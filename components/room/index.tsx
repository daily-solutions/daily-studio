import React from 'react';
import { DailyAudio } from '@daily-co/daily-react';

import { Tray } from '@/components/call/tray';
import { Layout } from '@/components/call/tray/layout';
import { Listeners } from '@/components/room/listeners';
import { BroadcastModal } from '@/components/room/modals/broadcast';
import { JoinStageModal } from '@/components/room/modals/joinStage';
import { RTMPModal } from '@/components/room/modals/rtmp';
import { Sidebar } from '@/components/room/sidebar';
import { Stage } from '@/components/room/stage';
import { VcsPreview } from '@/components/vcs/vcsPreview';

export function Room() {
  return (
    <div className="flex-1">
      <div className="flex h-full">
        <div className="relative flex w-full flex-1 flex-col md:w-[calc(100%-400px)]">
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
      <Listeners />
    </div>
  );
}
