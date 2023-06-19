import React from 'react';

import { siteConfig } from '@/config/site';
import { CreateCallButton } from '@/components/CreateCallButton';
import { Header } from '@/components/Header';

export default function IndexPage() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
        <h2 className="text-2xl font-bold leading-3">{siteConfig.name}</h2>
        <p className="leading-7">{siteConfig.description}</p>
        <CreateCallButton />
      </div>
    </div>
  );
}
