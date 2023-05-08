import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { useParams } from '@/states/params';
import { DailyParticipantsObject } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useParticipantIds,
} from '@daily-co/daily-react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

import { getDiff } from '@/lib/getDiff';
import { VCSCompositionWrapper } from '@/components/vcs/vcsCompositionWrapper';

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
  const participantIds = useParticipantIds({
    filter: useCallback(
      (participant) => participant.permissions.hasPresence,
      []
    ),
  });

  const [meetingState] = useMeetingState();
  const [params] = useParams();

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

  useEffect(() => {
    if (!vcsCompRef.current || !localSessionId) return;

    const participants = daily?.participants();
    const activeVideoInputs = participantIds.map((id) => {
      const participant = getParticipant(participants, localSessionId, id);
      return {
        id,
        displayName: participant?.user_name,
      };
    });
    const remoteTracksBySessionId = participantIds.reduce((tracks, id) => {
      const participant = getParticipant(participants, localSessionId, id);

      return {
        ...tracks,
        [id]: {
          track: participant?.tracks?.video?.persistentTrack,
          userName: participant?.user_name,
        },
      };
    }, {});

    if (participantIds.length > 0) {
      vcsCompRef.current.applyMeetingTracksAndOrdering(
        remoteTracksBySessionId,
        activeVideoInputs
      );
    } else {
      vcsCompRef.current.reconcileMeetingTracks(remoteTracksBySessionId);
    }
  }, [daily, localSessionId, participantIds]);

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
  }, [params]);

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
