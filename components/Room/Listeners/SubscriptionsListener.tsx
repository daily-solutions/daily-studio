import { useCallback } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import { useDaily, useThrottledDailyEvent } from '@daily-co/daily-react';

export function SubscriptionsListener() {
  const daily = useDaily();

  const handleSubscriptions = useCallback(
    (events) => {
      if (!daily) return;

      const updateParticipants = {};

      events.forEach((event) => {
        const participant: DailyParticipant = event.participant;
        const {
          permissions: { hasPresence },
          userData,
          session_id,
          tracks,
          local,
          participantType,
        } = participant;

        if (local) return;

        const isRMP = participantType === 'remote-media-player';
        const isSubscribed =
          tracks?.[isRMP ? 'rmpVideo' : 'video']?.subscribed === true;

        if (hasPresence) {
          if ((userData?.['onStage'] || isRMP) && !isSubscribed) {
            // If the participant is on stage, subscribe to their video
            updateParticipants[session_id] = { setSubscribedTracks: true };
          } else {
            // If the participant is not on stage, unsubscribe from their video
            updateParticipants[session_id] = { setSubscribedTracks: false };
          }
        } else if (isSubscribed) {
          // If the participant doesn't have presence, unsubscribe from their video
          updateParticipants[session_id] = { setSubscribedTracks: false };
        }
      });

      if (Object.keys(updateParticipants).length === 0) return;
      daily.updateParticipants(updateParticipants);
    },
    [daily],
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions,
  );

  return null;
}
