'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { useMessages } from '@/states/messagesState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import {
  useDaily,
  useDailyEvent,
  useLocalSessionId,
  useThrottledDailyEvent,
} from '@daily-co/daily-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Haircheck } from '@/components/call/haircheck';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { Room } from '@/components/room';

type AppMessage = {
  event: 'message';
  id: string;
  userName: string;
  message: string;
};

export function Call() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();

  const [meetingState, setMeetingState] = useMeetingState();
  const [, setMessages] = useMessages();

  useEffect(
    () => setMeetingState(daily?.meetingState() ?? 'loading'),
    [daily, setMeetingState]
  );

  useThrottledDailyEvent(
    ['loading', 'loaded', 'joining-meeting', 'joined-meeting', 'left-meeting'],
    useCallback(
      (evts) => {
        evts.forEach(() => {
          setMeetingState(daily?.meetingState() ?? 'loading');
        });
      },
      [daily, setMeetingState]
    )
  );

  useDailyEvent(
    'app-message',
    useCallback(
      (ev: DailyEventObjectAppMessage<AppMessage>) => {
        const { event, ...rest } = ev.data;
        if (event !== 'message') return;

        setMessages((messages) => [
          ...messages,
          {
            ...rest,
            fromId: ev.fromId,
            isLocal: false,
            receivedAt: new Date(),
          },
        ]);
      },
      [setMessages]
    )
  );

  const content = useMemo(() => {
    switch (meetingState) {
      case 'loaded':
        return <Haircheck />;
      case 'joined-meeting':
        return <Room />;
      case 'left-meeting':
        return (
          <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
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
          <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
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
