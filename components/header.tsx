'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useMeetingState } from '@/states/meetingState';

import { siteConfig } from '@/config/site';
import { useLiveStream } from '@/hooks/useLiveStream';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Header() {
  const [meetingState] = useMeetingState();

  const { isLiveStreaming, startLiveStreaming, stopLiveStreaming } =
    useLiveStream();

  const handleLiveStream = useCallback(
    () => (isLiveStreaming ? stopLiveStreaming() : startLiveStreaming()),
    [isLiveStreaming, startLiveStreaming, stopLiveStreaming]
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-2 flex h-16 items-center sm:mx-5 sm:justify-between">
        <div className="gap-6 md:gap-10">
          <Link href="/">
            <span className="inline-block font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        {meetingState === 'joined-meeting' ? (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              variant={isLiveStreaming ? 'destructive' : 'default'}
              onClick={handleLiveStream}
            >
              {isLiveStreaming ? 'End broadcast' : 'Start Broadcast'}
            </Button>
          </div>
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
