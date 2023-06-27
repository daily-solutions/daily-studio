import React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Menu } from '@/components/Header/Menu';
import { StatusBadge } from '@/components/Header/StatusBadge';
import { ViewerCount } from '@/components/Header/ViewerCount';

export default function CallHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center justify-between">
        <Link href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <StatusBadge />
        <div className="flex items-center justify-center gap-x-2">
          <ViewerCount />
          <Menu />
        </div>
      </div>
    </header>
  );
}
