import React from 'react';

import { Audio } from '@/components/call/tray/audio';
import { Layout } from '@/components/call/tray/layout';
import { Leave } from '@/components/call/tray/leave';
import { Screenshare } from '@/components/call/tray/screenshare';
import { Video } from '@/components/call/tray/video';
import { Sidebar } from '@/components/room/sidebar';
import { VcsPreview } from '@/components/vcs/vcsPreview';

interface Props {
  isProducer?: boolean;
}

export function Room({ isProducer = false }: Props) {
  return (
    <div className="flex h-full w-full flex-1">
      <div className="flex h-full w-full flex-col">
        <div className="flex-1">
          <VcsPreview />
        </div>
        <div className="flex h-20 w-full items-center justify-between border-t p-4">
          <div className="flex items-center">
            <Video />
            <Audio />
            <Screenshare />
          </div>
          <Layout />
          <Leave />
        </div>
      </div>
      {isProducer && <Sidebar />}
    </div>
  );
}
