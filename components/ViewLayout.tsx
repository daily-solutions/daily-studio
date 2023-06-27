'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/ui/Card';
import { Icons } from '@/ui/Icons';
import { useToast } from '@/ui/useToast';
import {
  DailyEventObject,
  DailyEventObjectNetworkConnectionEvent,
} from '@daily-co/daily-js';
import {
  useDaily,
  useDailyEvent,
  useMeetingState,
} from '@daily-co/daily-react';
import { Haircheck } from 'components/Room/Haircheck';

import { Header } from '@/components/Header';
import { Room } from '@/components/Room';

export function ViewLayout() {
  const daily = useDaily();
  const meetingState = useMeetingState();

  const { toast } = useToast();

  useDailyEvent(
    'load-attempt-failed',
    useCallback(
      (ev: DailyEventObject) => {
        toast({
          title: 'Failed to load meeting',
          description: ev.errorMsg,
          variant: 'destructive',
        });
      },
      [toast]
    )
  );

  useDailyEvent(
    'network-connection',
    useCallback(
      (ev: DailyEventObjectNetworkConnectionEvent) => {
        if (ev.event !== 'interrupted') return;
        toast({
          title: 'Network connection interrupted',
          description: 'Attempting to reconnect...',
          variant: 'destructive',
        });
      },
      [toast]
    )
  );

  useDailyEvent(
    'error',
    useCallback(() => {
      toast({
        title: 'Looks like you are offline',
        description: 'Leaving the call...',
        variant: 'destructive',
      });
      daily?.leave();
    }, [daily, toast])
  );

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
