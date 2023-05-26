import React, { useCallback } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import { useViewers } from '@/states/viewersState';
import { useLocalSessionId, useParticipantIds } from '@daily-co/daily-react';

import { useSyncParticipants } from '@/hooks/useSyncParams';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Participant } from '@/components/room/sidebar/people/Participant';
import { Viewer } from '@/components/room/sidebar/people/Viewer';

export function People() {
  const localSessionId = useLocalSessionId();
  const [paxState, setPaxState] = useParticipantsState();

  const participantIds = useParticipantIds();
  const { updateParticipants } = useSyncParticipants();

  const [viewers] = useViewers();

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
        <h3 className="text-xs">Participants</h3>
        <div className="mt-2 flex flex-col gap-y-1">
          {participantIds.map((id) => (
            <Participant key={id} sessionId={id} />
          ))}
        </div>
      </div>
      {viewers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs">Viewers</h3>
          <div className="mt-2 flex flex-col gap-y-1">
            {viewers.map((viewer) => (
              <Viewer key={viewer.sessionId} {...viewer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
