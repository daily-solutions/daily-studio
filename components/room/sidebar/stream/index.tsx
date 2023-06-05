import React from 'react';
import { useCreateRTMP } from '@/states/createRTMPState';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/icons';
import { Rtmp } from '@/components/room/sidebar/stream/Rtmp';

export function Stream({
  showHeader = false,
  showSwitch = false,
}: {
  showHeader?: boolean;
  showSwitch?: boolean;
}) {
  const [{ rtmps }] = useMeetingSessionState<MeetingSessionState>();
  const [, setCreateRTMP] = useCreateRTMP();

  return (
    <div>
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h3>RTMP Destinations</h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(rtmps ?? {}).length} destinations
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
      {Object.keys(rtmps ?? {}).length > 0 ? (
        <div className="flex flex-col space-y-4">
          {Object.entries(rtmps ?? {}).map(([id, rtmp]) => (
            <Rtmp rtmp={rtmp} id={id} key={id} showSwitch={showSwitch} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="stream"
          title="Can't find RTMP destinations"
          description="Configure RTMP destinations"
        />
      )}
    </div>
  );
}
