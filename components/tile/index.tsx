import React, { memo } from 'react';
import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { NoVideoTile } from '@/components/tile/NoVideoTile';
import { TileMenu } from '@/components/tile/TileMenu';
import { TileUserName } from '@/components/tile/TileUserName';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  sessionId: string;
  noVideoTileColor?: string;
  showMenu?: boolean;
}

function TileComponent({
  sessionId,
  className,
  noVideoTileColor = 'bg-muted',
  showMenu = false,
}: Props) {
  const [videoState, participantType] = useParticipantProperty(sessionId, [
    'tracks.video.state',
    'participantType',
  ]);

  const state =
    participantType === 'remote-media-player' ? 'playable' : videoState;

  return (
    <AspectRatio
      className={cn('relative rounded-md', noVideoTileColor, className)}
      ratio={16 / 9}
    >
      {state === 'off' ? (
        <NoVideoTile sessionId={sessionId} bgColor={noVideoTileColor} />
      ) : (
        <>
          <DailyVideo
            automirror
            fit="cover"
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
            }}
            sessionId={sessionId}
            type={
              participantType === 'remote-media-player' ? 'rmpVideo' : 'video'
            }
          />
          <TileUserName sessionId={sessionId} />
        </>
      )}
      {showMenu && <TileMenu sessionId={sessionId} />}
    </AspectRatio>
  );
}

export const Tile = memo(TileComponent);
