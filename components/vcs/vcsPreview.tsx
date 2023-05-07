import React, { useCallback, useEffect, useRef } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { DailyParticipantsObject } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useParticipantIds,
} from '@daily-co/daily-react';

import { VCSCompositionWrapper } from '@/components/vcs/vcsCompositionWrapper';

type ViewportSize = {
  w: number;
  h: number;
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

export function VcsPreview({
  viewportSize = { w: 1280, h: 720 },
}: {
  viewportSize?: ViewportSize;
}) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const participantIds = useParticipantIds({
    filter: useCallback(
      (participant) => participant.permissions.hasPresence,
      []
    ),
  });

  const [meetingState] = useMeetingState();
  const params = {};

  const vcsCompRef = useRef<VCSCompositionWrapper | null>(null);

  const updateDisplaySize = useCallback(() => {
    if (vcsCompRef.current) {
      vcsCompRef.current.rootDisplaySizeChanged();
    }
  }, []);

  const outputElementRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;

      if (meetingState === 'joined-meeting') {
        if (!vcsCompRef.current) {
          vcsCompRef.current = new VCSCompositionWrapper(
            el,
            viewportSize,
            params,
            { getAssetUrlCb }
          );
          vcsCompRef.current.start();
        } else {
          vcsCompRef.current.rootDisplaySizeChanged();
        }
      }
    },
    [meetingState, params, viewportSize]
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
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, [updateDisplaySize]);

  return <div className="max-h-full max-w-full" ref={outputElementRef} />;
}
