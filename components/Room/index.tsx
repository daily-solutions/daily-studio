import React from 'react';
import { DailyAudio } from '@daily-co/daily-react';

import { Modals } from '@/components/Room/Modals';
import { Sidebar } from '@/components/Room/Sidebar';
import { Stage } from '@/components/Room/Stage';
import { Tray } from '@/components/Room/Tray';
import { LayoutSwitchMenu } from '@/components/Room/Tray/LayoutSwitchMenu';
import { VcsPreview } from '@/components/Room/Vcs';

export function Room() {
  return (
    <div className="flex-1">
      <div className="flex h-full">
        <div className="relative flex w-full flex-1 flex-col md:w-[calc(100%-400px)]">
          <VcsPreview />
          <LayoutSwitchMenu />
          <Stage />
          <Tray />
        </div>
        <Sidebar />
      </div>
      <Modals />
      <DailyAudio autoSubscribeActiveSpeaker />
    </div>
  );
}
