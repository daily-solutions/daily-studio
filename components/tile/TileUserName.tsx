import { useMemo } from 'react';
import { useParticipantProperty } from '@daily-co/daily-react';

interface Props {
  sessionId: string;
}

export function TileUserName({ sessionId }: Props) {
  const [userName, isLocal, participantType] = useParticipantProperty(
    sessionId,
    ['user_name', 'local', 'participantType']
  );

  const tileName = useMemo(
    () =>
      participantType === 'remote-media-player' ? 'RMP' : userName || 'Guest',
    [userName, participantType]
  );

  return (
    <div className="absolute bottom-2 left-2 rounded-md bg-muted p-2">
      <p className="select-none text-sm">
        {tileName} {isLocal && '(You)'}
      </p>
    </div>
  );
}
