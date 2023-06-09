import React from 'react';
import { useViewers } from '@/states/viewersState';
import { useParticipantIds } from '@daily-co/daily-react';

import { useParticipants } from '@/hooks/useParticipants';
import { Participant } from '@/components/room/sidebar/people/Participant';
import { Viewer } from '@/components/room/sidebar/people/Viewer';

export function People() {
  const { participantIds } = useParticipants();

  const [viewers] = useViewers();

  return (
    <div className="p-4">
      <p className="mb-3 text-xs text-muted-foreground">
        {participantIds.length}{' '}
        {participantIds.length === 1 ? 'person' : 'people'} on stage
      </p>
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
