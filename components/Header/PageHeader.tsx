import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/ui/Button';
import { Icons } from '@/ui/Icons';

import { siteConfig } from '@/config/site';

export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center justify-between">
        <Link href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <Link href={siteConfig.links.github}>
          <div className={buttonVariants({ size: 'icon', variant: 'ghost' })}>
            <Icons.gitHub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
