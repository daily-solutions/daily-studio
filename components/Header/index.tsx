'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { siteConfig } from '@/config/site';

const CallHeader = dynamic(() =>
  import('@/components/Header/CallHeader').then((mod) => mod.CallHeader)
);
const GithubLink = dynamic(() =>
  import('@/components/Header/GithubLink').then((mod) => mod.GithubLink)
);

export function Header({ inCall = true }: { inCall?: boolean }) {
  return (
    <header className="min-h-16 sticky top-0 z-40 h-16 max-h-16 w-full border-b bg-background">
      <div className="mx-2 flex h-full items-center justify-between">
        <a href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </a>
        {inCall ? <CallHeader /> : <GithubLink />}
      </div>
    </header>
  );
}
