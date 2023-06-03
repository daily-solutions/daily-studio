import React from 'react';
import { useParticipantProperty } from '@daily-co/daily-react';

import { Label } from '@/components/ui/label';
import { ParticipantMenu } from '@/components/room/sidebar/people/ParticipantMenu';

export function Participant({ sessionId }: { sessionId: string }) {
  const [userName, isLocal] = useParticipantProperty(sessionId, [
    'user_name',
    'local',
  ]);

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={sessionId}>
        {userName || 'Guest'} {isLocal && '(You)'}
      </Label>
      <ParticipantMenu sessionId={sessionId} />
    </div>
  );
}
