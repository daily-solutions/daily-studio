import { useCallback } from 'react';
import {
  DailyEventObjectParticipant,
  DailyParticipant,
} from '@daily-co/daily-js';
import { useDaily, useThrottledDailyEvent } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

export function SubscriptionsListener() {
  const daily = useDaily();
  const isOwner = useIsOwner();

  const handleSubscriptions = useCallback(
    (events: DailyEventObjectParticipant[]) => {
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
        const isStaged =
          tracks?.[isRMP ? 'rmpVideo' : 'video']?.subscribed === 'staged';

        if (hasPresence) {
          if (userData?.['onStage'] || isRMP) {
            if (isSubscribed) return;
            // If the participant is on stage, subscribe to their video
            updateParticipants[session_id] = { setSubscribedTracks: true };
          } else {
            if (isSubscribed || isStaged) return;
            updateParticipants[session_id] = {
              setSubscribedTracks: isOwner ? true : 'staged',
            };
          }
        } else if (isSubscribed) {
          // If the participant doesn't have presence, unsubscribe from their video
          updateParticipants[session_id] = { setSubscribedTracks: false };
        }
      });

      if (Object.keys(updateParticipants).length === 0) return;
      daily.updateParticipants(updateParticipants);
    },
    [daily, isOwner],
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions,
  );

  return null;
}
