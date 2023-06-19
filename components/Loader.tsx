import React from 'react';
import { Icons } from '@/ui/Icons';

import { Header } from '@/components/Header';

export function Loader({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      {showHeader && <Header />}
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    </div>
  );
}
