import { useMemo } from 'react';
import { useParticipantProperty } from '@daily-co/daily-react';

export function NoVideoTile({ sessionId }: { sessionId: string }) {
  const [userName, isLocal, participantType] = useParticipantProperty(
    sessionId,
    ['user_name', 'local', 'participantType'],
  );

  const tileName = useMemo(
    () =>
      participantType === 'remote-media-player' ? 'RMP' : userName || 'Guest',
    [userName, participantType],
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center border text-muted-foreground">
      <h2>
        {tileName} {isLocal && '(You)'}
      </h2>
    </div>
  );
}
