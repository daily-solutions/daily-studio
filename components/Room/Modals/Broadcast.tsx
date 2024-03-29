import { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';
import { useCreateRTMP } from '@/states/createRTMPState';
import { Button } from '@/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/Dialog';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useLiveStream } from '@/hooks/useLiveStream';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Stream } from '@/components/Room/Sidebar/Stream';

export function BroadcastModal() {
  const [broadcast, setBroadcast] = useBroadcast();
  const [{ rtmps }] = useMeetingSessionState<MeetingSessionState>();
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
        {Object.keys(rtmps ?? {}).length > 0 && (
          <p
            className="cursor-pointer text-xs font-medium underline"
            onClick={() => setCreateRTMP(true)}
          >
            Want to add more RTMP destinations?
          </p>
        )}
        <DialogFooter className="mt-4">
          {Object.keys(rtmps ?? {}).length > 0 ? (
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
