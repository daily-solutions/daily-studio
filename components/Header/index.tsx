'use client';

import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/ui/Button';
import { useMeetingState } from '@daily-co/daily-react';

import { siteConfig } from '@/config/site';
import { StatusBadge } from '@/components/Header/StatusBadge';
import { ThemeToggle } from '@/components/Header/ThemeToggle';
import { ViewerCount } from '@/components/Header/ViewerCount';
import { Icons } from '@/components/Icons';

export function Header() {
  const meetingState = useMeetingState();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center justify-between">
        <Link href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <StatusBadge />
        <div className="flex items-center justify-center gap-x-2">
          {meetingState === 'joined-meeting' ? (
            <ViewerCount />
          ) : (
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
