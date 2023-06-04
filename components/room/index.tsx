import React from 'react';
import { DailyAudio } from '@daily-co/daily-react';

import { usePresence } from '@/hooks/usePresence';
import { useReceiveSettings } from '@/hooks/useReceiveSettings';
import { useTrackSubscriptions } from '@/hooks/useTrackSubscriptions';
import { Tray } from '@/components/call/tray';
import { Layout } from '@/components/call/tray/layout';
import { BroadcastModal } from '@/components/room/modals/broadcast';
import { JoinStageModal } from '@/components/room/modals/joinStage';
import { RTMPModal } from '@/components/room/modals/rtmp';
import { Sidebar } from '@/components/room/sidebar';
import { Stage } from '@/components/room/stage';
import { VcsPreview } from '@/components/vcs/vcsPreview';

export function Room() {
  usePresence();
  useTrackSubscriptions();
  useReceiveSettings();

  return (
    <div className="flex-1">
      <div className="flex">
        <div className="relative flex w-[70dvw] max-w-[70dvw] flex-1 flex-col 2xl:w-[75dvw] 2xl:max-w-[75dvw]">
          <VcsPreview />
          <Layout />
          <Stage />
          <Tray />
        </div>
        <Sidebar />
      </div>
      <RTMPModal />
      <BroadcastModal />
      <JoinStageModal />
      <DailyAudio />
    </div>
  );
}
