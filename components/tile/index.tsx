import React from 'react';
import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { NoVideoTile } from '@/components/tile/NoVideoTile';
import { TileUserName } from '@/components/tile/TileUserName';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  sessionId: string;
  noVideoTileColor?: string;
}

export function Tile({
  sessionId,
  className,
  noVideoTileColor = 'bg-muted',
}: Props) {
  const videoState = useParticipantProperty(sessionId, 'tracks.video.state');

  return (
    <AspectRatio
      className={cn('relative rounded-md', className)}
      ratio={16 / 9}
    >
      {videoState === 'off' ? (
        <NoVideoTile sessionId={sessionId} bgColor={noVideoTileColor} />
      ) : (
        <>
          <DailyVideo
            automirror
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
            }}
            sessionId={sessionId}
            type="video"
          />
          <TileUserName sessionId={sessionId} />
        </>
      )}
    </AspectRatio>
  );
}
