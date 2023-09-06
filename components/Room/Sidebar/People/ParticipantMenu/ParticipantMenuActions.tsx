import React from 'react';
import { useParticipantProperty } from '@daily-co/daily-react';

import { ModerationMenu } from '@/components/Room/Sidebar/People/ParticipantMenu/ModerationMenu';
import { PermissionsMenu } from '@/components/Room/Sidebar/People/ParticipantMenu/PermissionsMenu';
import { RemoteMediaPlayerMenu } from '@/components/Room/Sidebar/People/ParticipantMenu/RemoteMediaPlayerMenu';
import { StageVisibilityMenu } from '@/components/Room/Sidebar/People/ParticipantMenu/StageVisibilityMenu';

export function ParticipantMenuActions({ sessionId }: { sessionId: string }) {
  const participantType = useParticipantProperty(sessionId, 'participantType');

  return (
    <>
      {participantType === 'remote-media-player' ? (
        <RemoteMediaPlayerMenu />
      ) : (
        <>
          <StageVisibilityMenu sessionId={sessionId} />
          <ModerationMenu sessionId={sessionId} />
          <PermissionsMenu sessionId={sessionId} />
        </>
      )}
    </>
  );
}
