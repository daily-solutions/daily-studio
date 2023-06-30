'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { PageHeader } from '@/components/Header/PageHeader';

const CallHeader = dynamic(
  () => import('@/components/Header/CallHeader').then((mod) => mod.CallHeader),
  {
    loading: () => <PageHeader />,
  }
);

export function Header({ inCall = true }: { inCall?: boolean }) {
  return inCall ? <CallHeader /> : <PageHeader />;
}
