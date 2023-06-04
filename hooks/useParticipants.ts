import { useCallback } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import { useParticipantIds } from '@daily-co/daily-react';

export const useParticipants = () => {
  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        (p.userData?.['onStage'] ||
          p?.participantType === 'remote-media-player'),
      []
    ),
  });

  const waitingParticipantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        p.userData?.['acceptedToJoin'] &&
        !p.userData?.['onStage'],
      []
    ),
  });

  return {
    participantIds,
    waitingParticipantIds,
  };
};
