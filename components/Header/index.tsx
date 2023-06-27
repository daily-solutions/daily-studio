'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useMeetingState } from '@daily-co/daily-react';

const DefaultHeader = dynamic(() => import('./Header'));
const CallHeader = dynamic(() => import('./CallHeader'));

export function Header() {
  const meetingState = useMeetingState();

  return meetingState === 'joined-meeting' ? <CallHeader /> : <DefaultHeader />;
}
