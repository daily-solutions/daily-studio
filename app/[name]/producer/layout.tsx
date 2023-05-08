import '@/styles/globals.css';
import React from 'react';

import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { DailyClientProvider } from '@/components/room/DailyClientProvider';

interface ProducerLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

async function getToken(roomName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        roomName,
        isOwner: true,
      }),
    }
  );
  const { token } = await res.json();
  return token;
}

export default async function ProducerLayout({
  params: { name },
  children,
}: ProducerLayoutProps) {
  const token = await getToken(name);

  if (!token) {
    return (
      <div className="flex h-full w-full flex-1 flex-col">
        <Header />
        <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <DailyClientProvider roomName={name} token={token} requiresToken={true}>
      {children}
    </DailyClientProvider>
  );
}
