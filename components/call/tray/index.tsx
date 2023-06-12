import React, { useCallback, useMemo } from 'react';
import { useJoinStage } from '@/states/joinStageState';

import { useStage } from '@/hooks/useStage';
import { Button } from '@/components/ui/button';
import { Audio } from '@/components/call/tray/audio';
import { Invite } from '@/components/call/tray/invite';
import { Leave } from '@/components/call/tray/leave';
import { More } from '@/components/call/tray/more';
import { Network } from '@/components/call/tray/network';
import { Record } from '@/components/call/tray/record';
import { Rmp } from '@/components/call/tray/rmp';
import { Screenshare } from '@/components/call/tray/screenshare';
import { Settings } from '@/components/call/tray/settings';
import { Stream } from '@/components/call/tray/stream';
import { Video } from '@/components/call/tray/video';

export function Tray() {
  const [, setJoinStage] = useJoinStage();
  const { isRequesting, requestToJoin, cancelRequestToJoin, state } =
    useStage();

  const handleRequestToJoin = useCallback(
    () => (isRequesting ? cancelRequestToJoin() : requestToJoin()),
    [isRequesting, cancelRequestToJoin, requestToJoin]
  );

  const content = useMemo(() => {
    switch (state) {
      case 'request-to-join':
        return (
          <Button
            variant={isRequesting ? 'destructive' : 'default'}
            onClick={handleRequestToJoin}
          >
            {isRequesting ? 'Cancel request' : 'Request to join stage'}
          </Button>
        );
      case 'invited-to-stage':
        return <Button onClick={() => setJoinStage(true)}>Join stage</Button>;
      case 'on-stage':
      case 'back-stage':
        return (
          <div className="flex items-center">
            <Video />
            <Audio />
          </div>
        );
    }
  }, [handleRequestToJoin, isRequesting, setJoinStage, state]);

  return (
    <div className="flex h-20 max-h-20 w-full items-center justify-between overflow-hidden border-t bg-background p-4">
      {content}
      <div className="flex items-center justify-center">
        <Screenshare />
        <Rmp />
        <Record />
        <Stream />
        <Network />
        <Settings />
      </div>
      <div className="flex items-center">
        <More />
        <Invite />
        <Leave />
      </div>
    </div>
  );
}
