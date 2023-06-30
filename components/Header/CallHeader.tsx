'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { useIsMobile } from '@/hooks/useIsMobile';
import { StatusBadge } from '@/components/Header/StatusBadge';
import { ViewerCount } from '@/components/Header/ViewerCount';

const Menu = dynamic(() =>
  import('@/components/Header/Menu').then((mod) => mod.Menu)
);

export function CallHeader() {
  const isMobile = useIsMobile();

  return (
    <>
      <StatusBadge />
      <div className="flex items-center justify-center gap-x-2">
        <ViewerCount />
        {isMobile && <Menu />}
      </div>
    </>
  );
}
