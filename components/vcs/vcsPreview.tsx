import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { useParams } from '@/states/params';
import {
  DailyEventObject,
  DailyEventObjectAppMessage,
} from '@daily-co/daily-js';
import {
  useAppMessage,
  useDaily,
  useDailyEvent,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

import { getDiff } from '@/lib/getDiff';
import { useParticipantCount } from '@/hooks/useParticipantCount';
import { VCSCompositionWrapper } from '@/components/vcs/vcsCompositionWrapper';

type ActiveVideoInput = {
  id: string;
  displayName: string;
};

const getAssetUrlCb = (name: string, namespace: string, type: string) => {
  switch (type) {
    case 'font':
      return `/vcs/res/fonts/${name}`;
    case 'image':
      return namespace === 'composition'
        ? `/vcs/composition-assets/${name}`
        : `/vcs/res/test-assets/${name}`;
    default:
      return name;
  }
};

export function VcsPreview() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const userName = useParticipantProperty(
    localSessionId as string,
    'user_name'
  );
  const { present: participantCount } = useParticipantCount();

  const [meetingState] = useMeetingState();
  const [params, setParams] = useParams();

  const [remoteTracksBySessionId, setRemoteTracksBySessionId] = useState<
    Record<string, any>
  >({});
  const [activeVideoInputs, setActiveVideoInputs] = useState<
    ActiveVideoInput[]
  >([]);

  const updateActiveVideoInputs = useCallback(
    (
      participant: ActiveVideoInput,
      options: { add?: boolean; delete?: boolean } = {}
    ) => {
      if (!localSessionId) return;

      const arr: ActiveVideoInput[] = [];
      arr.push({
        id: localSessionId,
        displayName: userName,
      });

      const prev = activeVideoInputs;

      if (options.delete && prev && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const v = prev[i];
          if (
            v.id !== participant.id &&
            v.displayName !== participant.displayName
          ) {
            arr.push(v);
          }
        }
      } else {
        arr.push(...prev.filter((v) => v.id !== localSessionId));
      }

      if (options.add && participant.id && localSessionId !== participant.id) {
        arr.push({
          id: participant.id,
          displayName: participant.displayName,
        });
      }

      setActiveVideoInputs([...arr]);
    },
    [activeVideoInputs, localSessionId, userName]
  );

  const vcsCompRef = useRef<VCSCompositionWrapper | null>(null);

  const outputElementRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;

      const viewport = document.getElementById('aspectRatio');

      if (meetingState === 'joined-meeting' && viewport) {
        if (!vcsCompRef.current) {
          vcsCompRef.current = new VCSCompositionWrapper(
            el,
            { w: viewport.clientWidth, h: viewport.clientHeight },
            params,
            { getAssetUrlCb }
          );
          vcsCompRef.current.start();
        } else {
          vcsCompRef.current.rootDisplaySizeChanged({
            w: viewport.clientWidth,
            h: viewport.clientHeight,
          });
        }
      }
    },
    [meetingState, params]
  );

  const handleTrackEvents = useCallback(
    (ev: DailyEventObject) => {
      if (!ev || !ev.track || ev.track.kind !== 'video') return;

      const sessionId =
        ev.type === 'screenVideo'
          ? `${ev.participant.session_id}-screen`
          : ev.participant.session_id;

      const track = ev.participant.tracks[ev.type].persistentTrack;
      const userName = ev.participant.user_name;

      switch (ev.action) {
        case 'track-started':
          setRemoteTracksBySessionId((tracks) => ({
            ...tracks,
            [sessionId]: { track, userName },
          }));
          updateActiveVideoInputs(
            { id: sessionId, displayName: userName },
            { add: true }
          );
          break;
        case 'track-stopped':
          setRemoteTracksBySessionId((tracks) => {
            const key = Object.keys(tracks).find(
              (k) => tracks[k]?.track?.id === track?.id
            );
            if (key) delete tracks[key];
            return tracks;
          });
          updateActiveVideoInputs(
            { id: sessionId, displayName: userName },
            { delete: true }
          );
          break;
      }
    },
    [updateActiveVideoInputs]
  );

  useDailyEvent('track-started', handleTrackEvents);
  useDailyEvent('track-stopped', handleTrackEvents);

  useEffect(() => {
    if (!vcsCompRef.current || !localSessionId) return;

    if (participantCount > 0) {
      vcsCompRef.current.applyMeetingTracksAndOrdering(
        remoteTracksBySessionId,
        activeVideoInputs
      );
    } else {
      vcsCompRef.current.reconcileMeetingTracks(remoteTracksBySessionId);
    }
  }, [
    activeVideoInputs,
    daily,
    localSessionId,
    participantCount,
    remoteTracksBySessionId,
  ]);

  const sendAppMessage = useAppMessage<{ type: 'params'; params }>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<{ type: 'params'; params }>) => {
        if (ev.data.type !== 'params') return;

        setParams(ev.data.params);
      },
      [setParams]
    ),
  });

  useEffect(() => {
    if (!vcsCompRef.current) return;

    const diff = getDiff(vcsCompRef.current?.paramValues, params);
    if (
      diff &&
      Object.keys(diff).length === 0 &&
      Object.getPrototypeOf(diff) === Object.prototype
    )
      return;

    for (const key in diff) {
      vcsCompRef.current.sendParam(key, diff[key]);
    }

    // send params to other participants
    sendAppMessage({ type: 'params', params });
  }, [params, sendAppMessage]);

  useEffect(() => {
    const updateDisplaySize = () => {
      const viewport = document.getElementById('aspectRatio');

      if (vcsCompRef.current) {
        vcsCompRef.current.rootDisplaySizeChanged(
          viewport
            ? {
                w: viewport.clientWidth,
                h: viewport.clientHeight,
              }
            : null
        );
      }
    };
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, []);

  return (
    <div className="flex h-[calc(100%-4rem)] w-full flex-1 items-center justify-center bg-muted p-6">
      <AspectRatio
        id="aspectRatio"
        className="h-full w-full bg-black"
        ratio={16 / 9}
      >
        <div className="h-full w-full overflow-hidden" ref={outputElementRef} />
      </AspectRatio>
    </div>
  );
}
