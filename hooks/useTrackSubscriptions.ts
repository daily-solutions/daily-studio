import { useCallback, useEffect, useState } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import {
  useDaily,
  useParticipantIds,
  useThrottledDailyEvent,
} from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useParticipants } from '@/hooks/useParticipants';

export const useTrackSubscriptions = () => {
  const daily = useDaily();
  const isOwner = useIsOwner();

  const [subscribedToTracksAutomatically, setSubscribeToTracksAutomatically] =
    useState(false);

  const { participantIds } = useParticipants();

  const subscribedIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) => p.tracks.video.subscribed === true,
      []
    ),
  });

  useEffect(() => {
    if (!daily || !isOwner || subscribedToTracksAutomatically) return;

    daily.setSubscribeToTracksAutomatically(true);
    setSubscribeToTracksAutomatically(true);
  }, [daily, isOwner, subscribedToTracksAutomatically]);

  const handleSubscriptions = useCallback(
    (events) => {
      if (!daily || subscribedToTracksAutomatically) return;

      const updateParticipants = {};

      events.forEach((event) => {
        const { participant } = event;
        const { permissions, userData, session_id } = participant;

        if (permissions.hasPresence && userData?.['onStage']) {
          if (subscribedIds.includes(session_id)) return;
          updateParticipants[session_id] = { setSubscribedTracks: true };
        } else {
          if (!subscribedIds.includes(session_id)) return;
          updateParticipants[session_id] = { setSubscribedTracks: false };
        }
      });

      daily.updateParticipants(updateParticipants);
    },
    [daily, subscribedIds, subscribedToTracksAutomatically]
  );

  useThrottledDailyEvent(
    ['participant-joined', 'participant-updated'],
    handleSubscriptions
  );

  useEffect(() => {
    if (!daily || isOwner) return;

    participantIds.forEach((id) => {
      if (subscribedIds.includes(id)) return;

      daily.updateParticipant(id, {});
    });
  }, [daily, isOwner, participantIds, subscribedIds]);

  return {};
};
