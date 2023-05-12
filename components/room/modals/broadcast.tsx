import { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';
import { useRTMP } from '@/states/rtmpState';

import { useLiveStream } from '@/hooks/useLiveStream';
import { useSyncRTMPs } from '@/hooks/useSyncParams';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';

export function BroadcastModal() {
  const [broadcast, setBroadcast] = useBroadcast();
  const [rtmps, setRTMPs] = useRTMP();

  const { updateRTMPs } = useSyncRTMPs();

  const { startLiveStreaming, enableBroadcast } = useLiveStream();

  const handleChange = useCallback(
    (id: string, checked: boolean) => {
      setRTMPs((prev) => {
        const rtmps = {
          ...prev,
          [id]: {
            ...prev[id],
            active: checked,
          },
        };
        updateRTMPs(rtmps);
        return rtmps;
      });
    },
    [setRTMPs, updateRTMPs]
  );

  return (
    <Dialog open={broadcast} onOpenChange={setBroadcast}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>
            Select the RTMP destinations for your live broadcast.
          </DialogDescription>
        </DialogHeader>
        {Object.keys(rtmps).length > 0 ? (
          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm">RTMP Destinations</h3>
            {Object.entries(rtmps).map(([id, rtmp]) => (
              <div className="flex flex-col gap-y-2" key={id}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-medium">{rtmp.platform}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rtmp.streamURL}
                    </p>
                  </div>
                  <Switch
                    checked={rtmp.active}
                    onCheckedChange={(checked) => handleChange(id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-4 rounded-md bg-muted py-8">
            <div className="w-30 h-30 rounded-full bg-white p-4">
              <Icons.stream className="h-5 w-5" />
            </div>
            <h3 className="text-sm">Can&apos;t find RTMP destinations</h3>
            <p className="text-xs">
              Please configure RTMP destinations in the sidebar
            </p>
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button
            className="w-full"
            disabled={!enableBroadcast}
            onClick={startLiveStreaming}
          >
            Start broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
