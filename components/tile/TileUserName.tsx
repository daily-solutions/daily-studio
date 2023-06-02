import { useParticipantProperty } from '@daily-co/daily-react';

interface Props {
  sessionId: string;
}

export function TileUserName({ sessionId }: Props) {
  const userName = useParticipantProperty(sessionId, 'user_name');

  return (
    <div className="absolute bottom-2 left-2 rounded-md bg-muted p-2">
      <p className="select-none">{userName}</p>
    </div>
  );
}
