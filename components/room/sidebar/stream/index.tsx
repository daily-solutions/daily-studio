import React from 'react';
import { useCreateRTMP } from '@/states/createRTMPState';
import { useRTMP } from '@/states/rtmpState';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Rtmp } from '@/components/room/sidebar/stream/Rtmp';

export function Stream({
  showHeader = false,
  showSwitch = false,
}: {
  showHeader?: boolean;
  showSwitch?: boolean;
}) {
  const [rtmps] = useRTMP();
  const [, setCreateRTMP] = useCreateRTMP();

  return (
    <div>
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h3>RTMP Destinations</h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(rtmps).length} destinations
            </p>
          </div>
          <Button
            size="auto"
            variant="outline"
            onClick={() => setCreateRTMP(true)}
          >
            <Icons.plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      {Object.keys(rtmps).length > 0 ? (
        <div className="flex flex-col space-y-4">
          {Object.entries(rtmps).map(([id, rtmp]) => (
            <Rtmp rtmp={rtmp} id={id} key={id} showSwitch={showSwitch} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-4 rounded-md bg-muted py-8">
          <div className="w-30 h-30 rounded-full bg-background p-4">
            <Icons.stream className="h-5 w-5" />
          </div>
          <h3 className="text-sm">Can&apos;t find RTMP destinations</h3>
          <p className="text-xs">
            Please configure RTMP destinations to start broadcasting.
          </p>
        </div>
      )}
    </div>
  );
}
