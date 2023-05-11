import React, { useCallback } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import { useParticipantProperty } from '@daily-co/daily-react';

import { useSyncParticipants } from '@/hooks/useSyncParams';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PeopleItem({ sessionId }: { sessionId: string }) {
  const userName = useParticipantProperty(sessionId, 'user_name');
  const [paxState, setPaxState] = useParticipantsState();

  const { updateParticipants } = useSyncParticipants();

  const onCheckedChange = useCallback(
    (checked: Boolean) => {
      setPaxState((p) => {
        const paxState = {
          showAllParticipants: false,
          participantIds: checked
            ? [...p.participantIds, sessionId]
            : [...p.participantIds].filter((id) => id !== sessionId),
        };
        updateParticipants(paxState);
        return paxState;
      });
    },
    [sessionId, setPaxState, updateParticipants]
  );

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={sessionId}>{userName}</Label>
      <Switch
        name={sessionId}
        disabled={paxState.showAllParticipants}
        checked={
          paxState.showAllParticipants ||
          paxState.participantIds.includes(sessionId)
        }
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
