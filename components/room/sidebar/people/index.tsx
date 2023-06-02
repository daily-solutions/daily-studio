import React from 'react';
import { useViewers } from '@/states/viewersState';
import { useParticipantIds } from '@daily-co/daily-react';

import { Participant } from '@/components/room/sidebar/people/Participant';
import { Viewer } from '@/components/room/sidebar/people/Viewer';

export function People() {
  const participantIds = useParticipantIds();

  const [viewers] = useViewers();

  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-1">
        {participantIds.map((id) => (
          <Participant key={id} sessionId={id} />
        ))}
      </div>
      {viewers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs">Viewers</h3>
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
