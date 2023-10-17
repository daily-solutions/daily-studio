import { useCallback } from 'react';
import { config } from '@/config';
import {
  DailyEventObjectParticipant,
  DailyParticipant,
  DailyParticipantUpdateOptions,
} from '@daily-co/daily-js';
import {
  useDaily,
  usePermissions,
  useThrottledDailyEvent,
} from '@daily-co/daily-react';

export function SubscriptionsListener() {
  const daily = useDaily();
  const { hasPresence: hasLocalPresence } = usePermissions();

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
            if ((hasLocalPresence && isSubscribed) || isStaged) return;
            updateParticipants[session_id] = {
              setSubscribedTracks: hasLocalPresence ? true : 'staged',
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
    [daily, hasLocalPresence],
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions,
  );

  return null;
}
