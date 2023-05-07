'use client';

import React, { useCallback, useState } from 'react';
import { DailyMeetingState } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  useThrottledDailyEvent,
} from '@daily-co/daily-react';

import { Haircheck } from '@/components/call/haircheck';
import { Icons } from '@/components/icons';
import { Room } from '@/components/room';

export function Call() {
  const daily = useDaily();
  const [meetingState, setMeetingState] =
    useState<DailyMeetingState>('loading');

  const localSessionId = useLocalSessionId();
  const hasPresence = useParticipantProperty(
    localSessionId as string,
    'permissions.hasPresence'
  );

  useThrottledDailyEvent(
    ['loading', 'loaded', 'joining-meeting', 'joined-meeting'],
    useCallback(
      (evts) => {
        evts.forEach((ev) => {
          setMeetingState(daily?.meetingState() ?? 'loading');
        });
      },
      [daily]
    )
  );

  switch (meetingState) {
    case 'loaded':
      return <Haircheck />;
    case 'joined-meeting':
      return <Room isProducer={hasPresence} />;
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
}
