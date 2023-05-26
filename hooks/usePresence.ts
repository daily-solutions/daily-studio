import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useViewers } from '@/states/viewersState';
import {
  DailyEventObjectParticipantCounts,
  DailyParticipant,
} from '@daily-co/daily-js';
import {
  useDailyEvent,
  useLocalSessionId,
  useParticipantIds,
  useParticipantProperty,
} from '@daily-co/daily-react';

export const usePresence = () => {
  const { name } = useParams();
  const localSessionId = useLocalSessionId();
  const isOwner = useParticipantProperty(localSessionId, 'owner');

  const participantIds = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
  });

  const [viewers, setViewers] = useViewers();

  const fetchParticipants = useCallback(async () => {
    const participantsRes = await fetch(`/api/daily/presence?roomName=${name}`);
    const { participants } = await participantsRes.json();

    const viewers = participants
      .filter((p) => !participantIds.includes(p.id))
      .map((p) => ({
        sessionId: p.id,
        userName: p.userName,
      }));

    setViewers(viewers);
  }, [name, participantIds, setViewers]);

  useDailyEvent(
    'participant-counts-updated',
    useCallback(
      (ev: DailyEventObjectParticipantCounts) => {
        if (!isOwner) return;

        if (ev.participantCounts.hidden > 0) {
          fetchParticipants();
          setTimeout(fetchParticipants, 1500);
        } else setViewers([]);
      },
      [fetchParticipants, isOwner, setViewers]
    )
  );

  return viewers;
};
