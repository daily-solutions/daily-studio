import { useCallback, useState } from 'react';
import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

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
    sessionId,
  } = useRMP();
  const [url, setUrl] = useState('');

  const handleRMPPlayer = useCallback(async () => {
    if (sessionId) {
      await stopRemoteMediaPlayer();
    } else {
      await startRemoteMediaPlayer({
        url,
        settings: {
          state: 'play',
        },
      });
    }
  }, [sessionId, startRemoteMediaPlayer, stopRemoteMediaPlayer, url]);

  const handleRMPPlayPause = useCallback(async () => {
    if (!sessionId) return;

    await updateRemoteMediaPlayer({ state: isPlaying ? 'pause' : 'play' });
  }, [isPlaying, sessionId, updateRemoteMediaPlayer]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">Remote Media Player</p>
      {sessionId ? (
        <Button className="w-full" onClick={handleRMPPlayPause}>
          {isPlaying ? 'Pause' : 'Resume'}
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
        variant={sessionId ? 'destructive' : 'default'}
      >
        {sessionId ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
};

export function Rmp() {
  const localSessionId = useLocalSessionId();
  const isOwner = useParticipantProperty(localSessionId, 'owner');

  if (!isOwner) return null;

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
