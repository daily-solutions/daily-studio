import React from 'react';
import { config } from '@/config';

import { Header } from '@/components/Header';
import { StartCall } from '@/components/StartCall';

export default function IndexPage() {
  return (
    <div className="flex h-full flex-col">
      <Header inCall={false} />
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
        <h2 className="text-2xl font-bold leading-3">{config.name}</h2>
        <p className="w-full px-4 text-center leading-7 md:max-w-[600px] md:px-0">
          {config.description}
        </p>
        <StartCall />
      </div>
    </div>
  );
}
