import React from 'react';
import { Icon } from '@/ui/Icons';
import { Label } from '@/ui/Label';
import { useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { useIsOwner } from '@/hooks/useIsOwner';
import { ParticipantMenu } from '@/components/Room/Sidebar/People/ParticipantMenu';

const MUTED_STATES = ['interrupted', 'off', 'blocked'];

function ParticipantComponent({ sessionId }: { sessionId: string }) {
  const [userName, isLocal, audioState, screenState] = useParticipantProperty(
    sessionId,
    ['user_name', 'local', 'tracks.audio.state', 'tracks.screenVideo.state']
  );

  const isSharingScreen = !MUTED_STATES.includes(screenState);
  const isMuted = MUTED_STATES.includes(audioState);
  const isOwner = useIsOwner();

  return (
    <div className="flex items-center justify-between space-x-2">
      <p className="text-sm">
        {userName || 'Guest'} {isLocal && '(You)'}
      </p>
      <div className="flex items-center justify-center gap-x-2">
        {isSharingScreen && <Icon icon="screenShareOn" className="h-4 w-4" />}
        <Icon
          icon={isMuted ? 'micOff' : 'micOn'}
          className={cn(
            'h-4 w-4',
            isMuted ? 'text-destructive' : 'text-inherit'
          )}
        />
        {isOwner && <ParticipantMenu sessionId={sessionId} />}
      </div>
    </div>
  );
}

export const Participant = React.memo(ParticipantComponent);
