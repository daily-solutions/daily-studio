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
        const { permissions, userData, session_id, tracks, local } =
          participant;

        if (local) return;

        const isSubscribed = tracks.video.subscribed === true;

        if (permissions.hasPresence) {
          if (userData?.['onStage']) {
            // If the participant is on stage, subscribe to their video
            if (isSubscribed) return;
            updateParticipants[session_id] = { setSubscribedTracks: true };
          }
        } else {
          // If the participant is not on stage, unsubscribe from their video
          if (!isSubscribed) return;
          updateParticipants[session_id] = { setSubscribedTracks: false };
        }
      });

      daily.updateParticipants(updateParticipants);
    },
    [daily]
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions
  );

  return null;
}
