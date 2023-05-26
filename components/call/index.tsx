'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useMessages } from '@/states/messagesState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import {
  useDaily,
  useDailyEvent,
  useMeetingState,
} from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Haircheck } from '@/components/call/haircheck';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { Room } from '@/components/room';

export function Call() {
  const daily = useDaily();

  const meetingState = useMeetingState();
  const [, setMessages] = useMessages();

  const { toast } = useToast();

  const { acceptRequestToJoin } = useStage();

  const { appMessage } = useStage({
    onRequestToJoin: useCallback(
      ({ sessionId, userName }) => {
        toast({
          title: 'Request to join',
          description: `${userName} has requested to join the call`,
          action: (
            <ToastAction
              altText="Accept"
              onClick={() => acceptRequestToJoin(sessionId)}
            >
              Accept
            </ToastAction>
          ),
        });
      },
      [acceptRequestToJoin, toast]
    ),
  });

  useDailyEvent(
    'app-message',
    useCallback(
      (ev: DailyEventObjectAppMessage) => {
        const { event, ...rest } = ev.data;

        if (event === 'message') {
          setMessages((messages) => [
            ...messages,
            {
              ...rest,
              fromId: ev.fromId,
              isLocal: false,
              receivedAt: new Date(),
            },
          ]);
        } else appMessage(ev);
      },
      [appMessage, setMessages]
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
