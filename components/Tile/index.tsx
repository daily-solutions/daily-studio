import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { DESKTOP_ASPECT_RATIO } from '@/constants/aspectRatio';
import { AspectRatio } from '@/ui/AspectRatio';
import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { NoVideoTile } from '@/components/Tile/NoVideoTile';
import { TileBorder } from '@/components/Tile/TileBorder';
import { TileUserName } from '@/components/Tile/TileUserName';

const TileMenu = dynamic(() =>
  import('@/components/Tile/TileMenu').then((mod) => mod.TileMenu),
);

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  sessionId: string;
  noVideoTileColor?: string;
  showMenu?: boolean;
  aspectRatio?: number;
  videoFit?: 'contain' | 'cover';
}

function TileComponent({
  sessionId,
  className,
  noVideoTileColor = 'bg-muted',
  showMenu = false,
  aspectRatio = DESKTOP_ASPECT_RATIO,
  videoFit = 'contain',
}: Props) {
  const [videoState, participantType, isLocal] = useParticipantProperty(
    sessionId,
    ['tracks.video.state', 'participantType', 'local'],
  );

  const state =
    participantType === 'remote-media-player' ? 'playable' : videoState;

  return (
    <AspectRatio
      className={cn('group relative rounded-md', noVideoTileColor, className)}
      ratio={aspectRatio}
    >
      {state === 'off' ? (
        <NoVideoTile sessionId={sessionId} bgColor={noVideoTileColor} />
      ) : (
        <>
          <DailyVideo
            fit={videoFit}
            automirror
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
      {!isLocal && <TileBorder sessionId={sessionId} />}
    </AspectRatio>
  );
}

export const Tile = memo(TileComponent);
