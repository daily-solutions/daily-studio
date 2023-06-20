import React, { useCallback, useMemo } from 'react';
import { useJoinStage } from '@/states/joinStageState';
import { Button } from '@/ui/Button';

import { useStage } from '@/hooks/useStage';
import { Audio } from '@/components/Room/Tray/Audio';
import { Invite } from '@/components/Room/Tray/Invite';
import { Leave } from '@/components/Room/Tray/Leave';
import { More } from '@/components/Room/Tray/More';
import { Network } from '@/components/Room/Tray/Network';
import { Record } from '@/components/Room/Tray/Record';
import { Rmp } from '@/components/Room/Tray/Rmp';
import { Screenshare } from '@/components/Room/Tray/ScreenShare';
import { Settings } from '@/components/Room/Tray/Settings';
import { Stream } from '@/components/Room/Tray/Stream';
import { Video } from '@/components/Room/Tray/Video';

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
