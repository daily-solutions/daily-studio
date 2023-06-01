'use client';

import React from 'react';
import Link from 'next/link';
import { useMeetingState } from '@daily-co/daily-react';

import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';
import { HeaderMenu } from '@/components/header/menu';
import { Icons } from '@/components/icons';

export function Header() {
  const meetingState = useMeetingState();

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center sm:mx-5 sm:justify-between">
        <div className="gap-6 md:gap-10">
          <Link href="/">
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        {meetingState === 'joined-meeting' ? (
          <HeaderMenu />
        ) : (
          <div className="flex flex-1 items-center justify-end space-x-4">
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
          </div>
        )}
      </div>
    </header>
  );
}
