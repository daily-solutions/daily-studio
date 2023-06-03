import React from 'react';
import { DailyAudio } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { usePresence } from '@/hooks/usePresence';
import { Tray } from '@/components/call/tray';
import { BroadcastModal } from '@/components/room/modals/broadcast';
import { RTMPModal } from '@/components/room/modals/rtmp';
import { Sidebar } from '@/components/room/sidebar';
import { Stage } from '@/components/room/stage';
import { VcsPreview } from '@/components/vcs/vcsPreview';

export function Room() {
  usePresence();

  const isOwner = useIsOwner();

  return (
    <>
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
          <VcsPreview />
          {isOwner && <Stage />}
          <Tray />
        </div>
        <Sidebar />
      </div>
      <RTMPModal />
      <BroadcastModal />
      <DailyAudio />
    </>
  );
}
