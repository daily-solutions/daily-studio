import React from 'react';

import { DailyClientProvider } from '@/components/Providers';
import { ViewLayout } from '@/components/ViewLayout';

async function generateToken(roomName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        roomName,
        isOwner: true,
      }),
    },
  );
  const { token } = await res.json();
  return token;
}

export default async function ProducerPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const token = await generateToken(name);

  return (
    <DailyClientProvider roomName={name} token={token} requiresToken>
      <ViewLayout />
    </DailyClientProvider>
  );
}
