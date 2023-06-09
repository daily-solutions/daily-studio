'use client';

import React, { useEffect, useMemo } from 'react';
import { useDaily, useMeetingState } from '@daily-co/daily-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Haircheck } from '@/components/call/haircheck';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { Room } from '@/components/room';

export function Call() {
  const daily = useDaily();
  const meetingState = useMeetingState();

  const content = useMemo(() => {
    switch (meetingState) {
      case 'loaded':
        return <Haircheck />;
      case 'joined-meeting':
        return <Room />;
      case 'left-meeting':
        return (
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <Card className="flex flex-col items-center justify-center">
              <CardHeader>
                <h2 className="font-semibold">You&apos;ve left the call</h2>
              </CardHeader>
              <CardContent>
                <p>Have a nice day!</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'new':
      case 'joining-meeting':
      case 'loading':
      default:
        return (
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        );
    }
  }, [meetingState]);

  useEffect(() => {
    return () => {
      daily?.leave();
    };
  }, [daily]);

  return (
    <div className="flex h-full flex-col">
      <Header />
      {content}
    </div>
  );
}
