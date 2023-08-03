import React, { useCallback } from 'react';
import { useViewers } from '@/states/viewersState';
import { DailyParticipant } from '@daily-co/daily-js';
import { useParticipantIds } from '@daily-co/daily-react';

import { Participant } from '@/components/Room/Sidebar/People/Participant';
import { Viewer } from '@/components/Room/Sidebar/People/Viewer';

export function People() {
  const participantIds = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
    sort: useCallback((a: DailyParticipant, b: DailyParticipant) => {
      if (a.local || b.local) return 1;
      if (a.user_name < b.user_name) return -1;
      if (a.user_name > b.user_name) return 1;
      return 0;
    }, []),
  });

  const [viewers] = useViewers();

  return (
    <div className="p-4">
      <p className="text-muted-foreground mb-2 text-xs">
        {participantIds.length}{' '}
        {participantIds.length === 1 ? 'person' : 'people'} on the call
      </p>
      <div className="flex flex-col gap-y-1">
        {participantIds.map((id) => (
          <Participant key={id} sessionId={id} />
        ))}
      </div>
      {viewers.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs">Viewers</h3>
          <div className="flex flex-col gap-y-2">
            {viewers.map((viewer) => (
              <Viewer key={viewer.sessionId} {...viewer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
