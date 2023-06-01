import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';

import { NoVideoTile } from '@/components/Tile/NoVideoTile';
import { TileUserName } from '@/components/Tile/TileUserName';

export function Tile({ sessionId }: { sessionId: string }) {
  const videoState = useParticipantProperty(sessionId, 'tracks.video.state');

  return (
    <div className="relative pb-[56.25%]">
      {videoState === 'off' ? (
        <NoVideoTile sessionId={sessionId} />
      ) : (
        <>
          <DailyVideo
            style={{ position: 'absolute' }}
            sessionId={sessionId}
            type="video"
            width="100%"
            height="100%"
          />
          <TileUserName sessionId={sessionId} />
        </>
      )}
    </div>
  );
}
