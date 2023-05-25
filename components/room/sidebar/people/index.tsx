import React, { useCallback } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import { useLocalSessionId, useParticipantIds } from '@daily-co/daily-react';

import { useSyncParticipants } from '@/hooks/useSyncParams';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PeopleItem } from '@/components/room/sidebar/people/PeopleItem';

export function People() {
  const localSessionId = useLocalSessionId();
  const [paxState, setPaxState] = useParticipantsState();

  const participantIds = useParticipantIds();
  const { updateParticipants } = useSyncParticipants();

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setPaxState(() => {
        const paxState = {
          showAllParticipants: checked,
          participantIds: checked ? [] : [localSessionId],
        };
        updateParticipants(paxState);
        return paxState;
      });
    },
    [localSessionId, setPaxState, updateParticipants]
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="show-all-participants">Show all participants</Label>
        <Switch
          name="show-all-participants"
          checked={paxState.showAllParticipants}
          onCheckedChange={handleCheckedChange}
        />
      </div>
      <div className="mt-6">
        <h3 className="font-medium">Participants</h3>
        <div className="mt-2 flex flex-col gap-y-2">
          {participantIds.map((id) => (
            <PeopleItem key={id} sessionId={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
