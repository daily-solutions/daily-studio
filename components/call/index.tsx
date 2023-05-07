'use client';

import React, { useCallback, useEffect } from 'react';
import { useMeetingState } from '@/states/meetingState';
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
  const [meetingState, setMeetingState] = useMeetingState();

  const localSessionId = useLocalSessionId();
  const hasPresence = useParticipantProperty(
    localSessionId as string,
    'permissions.hasPresence'
  );

  useEffect(
    () => setMeetingState(daily?.meetingState() ?? 'loading'),
    [daily, setMeetingState]
  );

  useThrottledDailyEvent(
    ['loading', 'loaded', 'joining-meeting', 'joined-meeting'],
    useCallback(
      (evts) => {
        evts.forEach(() => {
          setMeetingState(daily?.meetingState() ?? 'loading');
        });
      },
      [daily, setMeetingState]
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
