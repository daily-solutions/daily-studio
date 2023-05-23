import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';

export function Tile({ sessionId }: { sessionId: string }) {
  const [videoState, userName] = useParticipantProperty(sessionId, [
    'tracks.video.state',
    'user_name',
  ]);

  return (
    <div className="relative pb-[56.25%]">
      {['playable', 'loading'].includes(videoState) ? (
        <DailyVideo
          style={{ position: 'absolute' }}
          sessionId={sessionId}
          type="video"
          width="100%"
          height="100%"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <h2>{userName}</h2>
        </div>
      )}
    </div>
  );
}
