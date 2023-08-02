import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { config } from '@/config';
import { useJoinStage } from '@/states/joinStageState';
import { Button } from '@/ui/Button';

import { useStage } from '@/hooks/useStage';
import { Audio } from '@/components/Room/Tray/Audio';
import { Invite } from '@/components/Room/Tray/Invite';
import { Leave } from '@/components/Room/Tray/Leave';
import { More } from '@/components/Room/Tray/More';
import { Network } from '@/components/Room/Tray/Network';
import { Screenshare } from '@/components/Room/Tray/ScreenShare';
import { Settings } from '@/components/Room/Tray/Settings';
import { Video } from '@/components/Room/Tray/Video';

const Rmp = dynamic(() =>
  import('@/components/Room/Tray/Rmp').then((mod) => mod.Rmp)
);

const Record = dynamic(() =>
  import('@/components/Room/Tray/Record').then((mod) => mod.Record)
);

const Stream = dynamic(() =>
  import('@/components/Room/Tray/Stream').then((mod) => mod.Stream)
);

const RequestToJoin = dynamic(() =>
  import('@/components/Room/Tray/RequestToJoin').then(
    (mod) => mod.RequestToJoin
  )
);

export function Tray() {
  const [, setJoinStage] = useJoinStage();
  const { state } = useStage();

  const content = useMemo(() => {
    switch (state) {
      case 'request-to-join':
        return <RequestToJoin />;
      case 'invited-to-stage':
        return <Button onClick={() => setJoinStage(true)}>Join stage</Button>;
      case 'on-stage':
      case 'back-stage':
        return (
          <div className="flex items-center">
            <Video />
            <Audio />
            <Screenshare />
          </div>
        );
      case 'viewer':
        return <p>You are a viewer</p>;
    }
  }, [setJoinStage, state]);

  return (
    <div className="min-h-20 flex h-20 max-h-20 w-full items-center justify-between overflow-hidden border-t bg-background p-4">
      {content}
      <div className="flex items-center justify-center">
        {config?.options?.enable_rmp && <Rmp />}
        {config?.options?.enable_recording && <Record />}
        {config?.options?.enable_live_streaming && <Stream />}
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
