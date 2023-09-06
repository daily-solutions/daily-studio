'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
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

import { Header } from '@/components/Header';
import { Listeners } from '@/components/Listeners';
import { Loader } from '@/components/Loader';

const Haircheck = dynamic(
  () => import('@/components/Room/Haircheck').then((mod) => mod.Haircheck),
  { loading: () => <Loader showHeader={false} /> },
);

const Room = dynamic(
  () => import('@/components/Room').then((mod) => mod.Room),
  { loading: () => <Loader showHeader={false} /> },
);

const LeftMeeting = dynamic(
  () => import('@/components/Room/LeftMeeting').then((mod) => mod.LeftMeeting),
  { loading: () => <Loader showHeader={false} /> },
);

const Error = dynamic(
  () =>
    import('@/components/Room/MeetingNotAvailable').then(
      (mod) => mod.MeetingNotAvailable,
    ),
  { loading: () => <Loader showHeader={false} /> },
);

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
      [toast],
    ),
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
      [toast],
    ),
  );

  useDailyEvent(
    'error',
    useCallback(
      (ev) => {
        if (ev.errorMsg === 'network unreachable') {
          toast({
            title: 'Looks like you are offline',
            description: 'Leaving the call...',
            variant: 'destructive',
          });
          daily?.leave();
        }
      },
      [daily, toast],
    ),
  );

  const content = useMemo(() => {
    switch (meetingState) {
      case 'loaded':
        return <Haircheck />;
      case 'joined-meeting':
        return <Room />;
      case 'left-meeting':
        return <LeftMeeting />;
      case 'error':
        return <Error />;
      case 'new':
      case 'joining-meeting':
      case 'loading':
      default:
        return <Loader showHeader={false} />;
    }
  }, [meetingState]);

  useEffect(() => {
    return () => {
      daily?.leave();
    };
  }, [daily]);

  return (
    <div className="flex h-full max-h-[100dvh] flex-col">
      <Header />
      {content}
      <Listeners />
    </div>
  );
}
