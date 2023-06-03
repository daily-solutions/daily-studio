import { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';
import { useCreateRTMP } from '@/states/createRTMPState';
import { useRTMP } from '@/states/rtmpState';

import { useLiveStream } from '@/hooks/useLiveStream';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stream } from '@/components/room/sidebar/stream';

export function BroadcastModal() {
  const [broadcast, setBroadcast] = useBroadcast();
  const [rtmps] = useRTMP();
  const [, setCreateRTMP] = useCreateRTMP();

  const { startLiveStreaming, enableBroadcast } = useLiveStream();

  const handleStartBroadcast = useCallback(() => {
    startLiveStreaming();
    setBroadcast(false);
  }, [setBroadcast, startLiveStreaming]);

  return (
    <Dialog open={broadcast} onOpenChange={setBroadcast}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>
            Select the RTMP destinations for your live broadcast.
          </DialogDescription>
        </DialogHeader>
        <Stream showSwitch />
        <DialogFooter className="mt-4">
          {Object.keys(rtmps).length > 0 ? (
            <Button
              className="w-full"
              disabled={!enableBroadcast}
              onClick={handleStartBroadcast}
            >
              Start broadcast
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setCreateRTMP(true)}>
              Configure RTMP destinations
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
