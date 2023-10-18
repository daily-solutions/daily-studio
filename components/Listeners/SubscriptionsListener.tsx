import { useCallback } from 'react';
import { config } from '@/config';
import {
  DailyEventObjectParticipant,
  DailyParticipant,
  DailyParticipantUpdateOptions,
} from '@daily-co/daily-js';
import { useDaily, useThrottledDailyEvent } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

export function SubscriptionsListener() {
  const daily = useDaily();
  const isLocalOwner = useIsOwner();

  const handleSubscriptions = useCallback(
    (events: DailyEventObjectParticipant[]) => {
      if (!daily) return;

      const updateParticipants: {
        [key: string]: DailyParticipantUpdateOptions;
      } = {};

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

        const isRMP = participantType === 'remote-media-player';

        if (local || (!config.options.enable_rmp && isRMP)) return;

        const isSubscribed =
          tracks?.[isRMP ? 'rmpVideo' : 'video']?.subscribed === true;
        const isStaged =
          tracks?.[isRMP ? 'rmpVideo' : 'video']?.subscribed === 'staged';

        if (hasPresence) {
          // @ts-ignore
          if (userData?.['onStage'] || isRMP) {
            if (isSubscribed) return;
            // If the participant is on stage, subscribe to their video
            updateParticipants[session_id] = { setSubscribedTracks: true };
          } else {
            // If the participant isn't on stage
            // - subscribe if local user is owner
            // - otherwise 'stage' the subscription
            if (isLocalOwner) {
              if (isSubscribed) return;
              updateParticipants[session_id] = { setSubscribedTracks: true };
            } else {
              if (isStaged) return;
              updateParticipants[session_id] = {
                setSubscribedTracks: 'staged',
              };
            }
          }
        } else if (isSubscribed || isStaged) {
          // If the participant doesn't have presence, unsubscribe from their video
          updateParticipants[session_id] = { setSubscribedTracks: false };
        }
      });

      if (Object.keys(updateParticipants).length === 0) return;
      daily.updateParticipants(updateParticipants);
    },
    [daily, isLocalOwner],
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions,
  );

  return null;
}
