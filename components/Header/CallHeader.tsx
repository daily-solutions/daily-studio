import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { StatusBadge } from '@/components/Header/StatusBadge';
import { ViewerCount } from '@/components/Header/ViewerCount';

const Menu = dynamic(() => import('@/components/Header/Menu'));

export default function CallHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center justify-between">
        <Link href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <StatusBadge />
        <div className="flex items-center justify-center gap-x-2">
          <ViewerCount />
          {isMobile && <Menu />}
        </div>
      </div>
    </header>
  );
}
