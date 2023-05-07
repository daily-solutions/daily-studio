import React from 'react';

import { Audio } from '@/components/call/tray/audio';
import { Leave } from '@/components/call/tray/leave';
import { Video } from '@/components/call/tray/video';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/room/sidebar';
import { VcsPreview } from '@/components/vcs/vcsPreview';

interface Props {
  isProducer?: boolean;
}

export function Room({ isProducer = false }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex h-full w-full flex-1">
        <div className="flex w-full flex-col">
          <VcsPreview />
          <div className="flex h-20 w-full items-center justify-between p-4">
            <div className="flex items-center">
              <Video />
              <Audio />
            </div>
            <Leave />
          </div>
        </div>
        {isProducer && <Sidebar />}
      </div>
    </div>
  );
}
