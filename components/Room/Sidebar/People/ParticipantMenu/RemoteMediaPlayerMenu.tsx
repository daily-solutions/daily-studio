import React, { useCallback } from 'react';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';

import { useRMP } from '@/hooks/useRMP';

export function RemoteMediaPlayerMenu() {
  const { isPlaying, updateRemoteMediaPlayer, stopRemoteMediaPlayer } =
    useRMP();

  const handlePlayPause = useCallback(
    async () =>
      await updateRemoteMediaPlayer({ state: isPlaying ? 'pause' : 'play' }),
    [isPlaying, updateRemoteMediaPlayer],
  );

  return (
    <>
      <DropdownMenuItem onClick={handlePlayPause}>
        {isPlaying ? (
          <Icons.pause className="mr-2 h-4 w-4" />
        ) : (
          <Icons.play className="mr-2 h-4 w-4" />
        )}
        <span>{isPlaying ? 'Pause' : 'Resume'}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive"
        onClick={stopRemoteMediaPlayer}
      >
        <Icons.stop className="mr-2 h-4 w-4" />
        <span>Stop media player</span>
      </DropdownMenuItem>
    </>
  );
}
