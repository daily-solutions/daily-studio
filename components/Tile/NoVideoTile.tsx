import { useParticipantProperty } from '@daily-co/daily-react';

export function NoVideoTile({ sessionId }: { sessionId: string }) {
  const [userName, isLocal] = useParticipantProperty(sessionId, [
    'user_name',
    'local',
  ]);

  return (
    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
      <h2>
        {userName} {isLocal && '(You)'}
      </h2>
    </div>
  );
}
