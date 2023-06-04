import React from 'react';

import { Call } from '@/components/call';
import { Loader } from '@/components/loader';
import { DailyClientProvider } from '@/components/room/DailyClientProvider';

async function generateToken(roomName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        roomName,
        isOwner: false,
      }),
    }
  );
  const { token } = await res.json();
  return token;
}

export default async function PresenterPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const token = await generateToken(name);

  if (!token) return <Loader showHeader={false} />;

  return (
    <DailyClientProvider roomName={name} token={token} requiresToken>
      <Call />
    </DailyClientProvider>
  );
}
