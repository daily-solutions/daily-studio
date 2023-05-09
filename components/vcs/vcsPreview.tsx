import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { useParams } from '@/states/params';
import {
  DailyEventObjectAppMessage,
  DailyParticipantsObject,
} from '@daily-co/daily-js';
import {
  useAppMessage,
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  useThrottledDailyEvent,
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

const getParticipant = (
  participants: DailyParticipantsObject | undefined,
  localSessionId: string,
  sessionId: string
) => {
  if (localSessionId === sessionId) return participants?.local;
  else return participants?.[sessionId];
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
      addParticipant: ActiveVideoInput | null,
      deleteParticipant: ActiveVideoInput | null
    ) => {
      if (!localSessionId) return;

      const arr: ActiveVideoInput[] = [];
      arr.push({
        id: localSessionId,
        displayName: userName,
      });

      const prev = activeVideoInputs;

      if (prev && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const v = prev[i];
          if (
            v.id !== deleteParticipant?.id &&
            v.displayName !== deleteParticipant?.displayName
          ) {
            arr.push(v);
          }
        }
      }

      if (addParticipant?.id && localSessionId !== addParticipant?.id) {
        arr.push({
          id: addParticipant.id,
          displayName: addParticipant.displayName,
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
            {
              getAssetUrlCb,
            }
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

  useThrottledDailyEvent(
    ['track-started', 'track-stopped'],
    useCallback(
      (evnts) => {
        if (evnts.length === 0) return;

        evnts.forEach((ev) => {
          if (!ev || !ev.track || ev.track.kind !== 'video') return;

          switch (ev.action) {
            case 'track-started':
              if (ev.type === 'screenVideo') {
                setRemoteTracksBySessionId((tracks) => ({
                  ...tracks,
                  [`${ev.participant.session_id}-screen`]: {
                    track: ev.participant.tracks[ev.type].persistentTrack,
                    userName: ev.participant.user_name,
                  },
                }));
                updateActiveVideoInputs(
                  {
                    id: `${ev.participant.session_id}-screen`,
                    displayName: ev.participant.user_name,
                  },
                  null
                );
              } else {
                setRemoteTracksBySessionId((tracks) => ({
                  ...tracks,
                  [ev.participant.session_id]: {
                    track: ev.participant.tracks[ev.type].persistentTrack,
                    userName: ev.participant.user_name,
                  },
                }));
                updateActiveVideoInputs(
                  {
                    id: ev.participant.session_id,
                    displayName: ev.participant.user_name,
                  },
                  null
                );
              }
              break;
            case 'track-stopped':
              if (ev.type === 'screenVideo') {
                setRemoteTracksBySessionId((tracks) => {
                  const sessionId = `${ev.participant.session_id}-screen`;
                  if (sessionId) delete tracks[sessionId];
                  else if (ev?.track) {
                    const key = Object.keys(tracks).find(
                      (k) => tracks[k]?.track.id === ev.track.id
                    );
                    if (key) delete tracks[key];
                    else
                      console.warn(
                        "** lost remote track wasn't somehow seen before"
                      );
                  }
                  return tracks;
                });
                updateActiveVideoInputs(null, {
                  id: `${ev.participant.session_id}-screen`,
                  displayName: ev.participant.user_name,
                });
              } else {
                setRemoteTracksBySessionId((tracks) => {
                  const sessionId = ev.participant?.session_id;
                  if (sessionId) delete tracks[sessionId];
                  else if (ev?.track) {
                    const key = Object.keys(tracks).find(
                      (key) => tracks[key]?.track === ev.track
                    );
                    if (key) delete tracks[key];
                    else
                      console.warn(
                        "** lost remote track wasn't somehow seen before"
                      );
                  }
                  return tracks;
                });
                updateActiveVideoInputs(null, {
                  id: ev.participant.session_id,
                  displayName: ev.participant.user_name,
                });
              }
              break;
          }
        });
      },
      [updateActiveVideoInputs]
    )
  );

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
      <AspectRatio id="aspectRatio" className="bg-black" ratio={16 / 9}>
        <div ref={outputElementRef} />
      </AspectRatio>
    </div>
  );
}
