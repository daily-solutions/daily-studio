import '@/styles/globals.css';
import React from 'react';

import { DailyClientProvider } from '@/components/room/DailyClientProvider';

interface ProducerLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default async function ProducerLayout({
  params: { name },
  children,
}: ProducerLayoutProps) {
  return (
    <DailyClientProvider roomName={name} requiresToken={true}>
      {children}
    </DailyClientProvider>
  );
}
