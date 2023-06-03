import React from 'react';
import { useJoinStage } from '@/states/joinStageState';

import { useStage } from '@/hooks/useStage';
import { Button } from '@/components/ui/button';
import { Audio } from '@/components/call/tray/audio';
import { Invite } from '@/components/call/tray/invite';
import { Layout } from '@/components/call/tray/layout';
import { Leave } from '@/components/call/tray/leave';
import { Rmp } from '@/components/call/tray/rmp';
import { Screenshare } from '@/components/call/tray/screenshare';
import { Settings } from '@/components/call/tray/settings';
import { Video } from '@/components/call/tray/video';

export function Tray() {
  const [, setJoinStage] = useJoinStage();
  const {
    isRequesting,
    toggleRequestToJoin,
    showRequestToJoin,
    showInvitedToJoin,
    showVideoControls,
  } = useStage();

  return (
    <div className="h-20 w-full border-t bg-background p-4">
      <div className="flex items-center justify-between">
        {showRequestToJoin && (
          <Button
            variant={isRequesting ? 'destructive' : 'default'}
            onClick={toggleRequestToJoin}
          >
            {isRequesting ? 'Cancel request' : 'Request to join stage'}
          </Button>
        )}
        {showInvitedToJoin && (
          <Button onClick={() => setJoinStage(true)}>Join stage</Button>
        )}
        {showVideoControls && (
          <div className="flex items-center">
            <Video />
            <Audio />
            <Screenshare />
            <Rmp />
          </div>
        )}
        <Layout />
        <div className="flex items-center">
          <Invite />
          <Settings />
          <Leave />
        </div>
      </div>
    </div>
  );
}
