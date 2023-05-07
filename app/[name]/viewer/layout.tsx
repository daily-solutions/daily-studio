import '@/styles/globals.css';
import React from 'react';

import { DailyClientProvider } from '@/components/room/DailyClientProvider';

export default async function ViewerLayout({
  params: { name },
  children,
}: React.PropsWithChildren<{ params: { name: string } }>) {
  return <DailyClientProvider roomName={name}>{children}</DailyClientProvider>;
}
