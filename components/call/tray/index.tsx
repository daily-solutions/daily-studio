import React from 'react';
import { usePermissions } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { Button } from '@/components/ui/button';
import { Audio } from '@/components/call/tray/audio';
import { Layout } from '@/components/call/tray/layout';
import { Leave } from '@/components/call/tray/leave';
import { Rmp } from '@/components/call/tray/rmp';
import { Screenshare } from '@/components/call/tray/screenshare';
import { Settings } from '@/components/call/tray/settings';
import { Video } from '@/components/call/tray/video';

export function Tray() {
  const { hasPresence } = usePermissions();

  const { isRequesting, toggleRequestToJoin } = useStage();

  return (
    <div className="h-20 w-full border-t bg-background p-4">
      <div className="flex items-center justify-between">
        {hasPresence ? (
          <div className="flex items-center">
            <Video />
            <Audio />
            <Screenshare />
            <Rmp />
          </div>
        ) : (
          <Button
            variant={isRequesting ? 'destructive' : 'default'}
            onClick={toggleRequestToJoin}
          >
            {isRequesting ? 'Cancel request' : 'Request to join stage'}
          </Button>
        )}
        <Layout />
        <div className="flex items-center">
          <Settings />
          <Leave />
        </div>
      </div>
    </div>
  );
}
