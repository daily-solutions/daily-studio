'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';
import { useMeetingState } from '@daily-co/daily-react';

import { siteConfig } from '@/config/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { StatusBadge } from '@/components/Header/StatusBadge';
import { ViewerCount } from '@/components/Header/ViewerCount';

const Menu = dynamic(() =>
  import('@/components/Header/Menu').then((mod) => mod.Menu)
);

export function CallHeader() {
  const isMobile = useIsMobile();
  const meetingState = useMeetingState();

  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center justify-between">
        <Link href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {meetingState === 'joined-meeting' && <StatusBadge />}
        <div className="flex items-center justify-center gap-x-2">
          {meetingState === 'joined-meeting' ? (
            <>
              <ViewerCount />
              {isMobile && <Menu />}
            </>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => router.push(siteConfig.links.github)}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
