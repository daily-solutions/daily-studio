import { useCallback, useState } from 'react';

import { useRMP } from '@/hooks/useRMP';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icon } from '@/components/icons';

export const RMPPopover = () => {
  const {
    isPlaying,
    startRemoteMediaPlayer,
    stopRemoteMediaPlayer,
    updateRemoteMediaPlayer,
  } = useRMP();
  const [url, setUrl] = useState('');

  const handleRMPPlayer = useCallback(async () => {
    if (isPlaying) {
      await stopRemoteMediaPlayer();
    } else {
      await startRemoteMediaPlayer({
        url,
        settings: {
          state: 'play',
        },
      });
    }
  }, [isPlaying, startRemoteMediaPlayer, stopRemoteMediaPlayer, url]);

  const handlePauseRMP = useCallback(async () => {
    if (!isPlaying) return;

    await updateRemoteMediaPlayer({ state: 'pause' });
  }, [isPlaying, updateRemoteMediaPlayer]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">Remote Media Player</p>
      {isPlaying ? (
        <Button className="w-full" onClick={handlePauseRMP}>
          Pause
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Label>URL</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      )}
      <Button
        className="w-full"
        onClick={handleRMPPlayer}
        variant={isPlaying ? 'destructive' : 'default'}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
};

export function Rmp() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="media" className="h-6 w-6" />
            <p className="text-xs">RMP</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-100">
        <RMPPopover />
      </PopoverContent>
    </Popover>
  );
}
