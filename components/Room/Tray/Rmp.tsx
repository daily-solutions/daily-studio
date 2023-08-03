import { useCallback, useState } from 'react';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { useToast } from '@/ui/useToast';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useRMP } from '@/hooks/useRMP';

export const RMPPopover = () => {
  const { toast } = useToast();
  const {
    isPlaying,
    startRemoteMediaPlayer,
    stopRemoteMediaPlayer,
    updateRemoteMediaPlayer,
    sessionId,
  } = useRMP({
    onError: useCallback(
      (e) =>
        toast({
          title: 'Failed to start remote media player',
          description: e,
          variant: 'destructive',
        }),
      [toast]
    ),
  });
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
      <p className="text-muted-foreground text-xs">Remote Media Player</p>
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
        disabled={!(url || sessionId)}
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
  const isOwner = useIsOwner();

  const { sessionId } = useRMP();

  if (!isOwner) return null;

  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <Button
          variant="ghost"
          size="trayButton"
          className={sessionId ? 'text-destructive' : 'text-inherit'}
        >
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="media" className="h-6 w-6" />
            <p className="text-xs">RMP</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-max">
        <RMPPopover />
      </PopoverContent>
    </Popover>
  );
}
