import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useViewers } from '@/states/viewersState';
import {
  DailyEventObjectParticipantCounts,
  DailyParticipant,
} from '@daily-co/daily-js';
import { useDailyEvent, useParticipantIds } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

interface Participant {
  id: string;
  userName: string;
}

export function PresenceListener() {
  const { name } = useParams();
  const isOwner = useIsOwner();

  const participantIds = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
  });

  const [, setViewers] = useViewers();

  const fetchParticipants = useCallback(async () => {
    const participantsRes = await fetch(`/api/daily/presence?roomName=${name}`);
    const { participants }: { participants: Participant[] } =
      await participantsRes.json();

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
          setTimeout(fetchParticipants, 2500);
        } else setViewers([]);
      },
      [fetchParticipants, isOwner, setViewers],
    ),
  );

  return null;
}
