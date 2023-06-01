import { useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';

export function NoVideoTile({
  sessionId,
  bgColor = 'bg-muted',
}: {
  sessionId: string;
  bgColor?: string;
}) {
  const [userName, isLocal] = useParticipantProperty(sessionId, [
    'user_name',
    'local',
  ]);

  return (
    <div
      className={cn(
        `absolute inset-0 flex items-center justify-center border  text-muted-foreground`,
        bgColor
      )}
    >
      <h2>
        {userName} {isLocal && '(You)'}
      </h2>
    </div>
  );
}
