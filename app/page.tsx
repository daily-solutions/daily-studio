import React from 'react';
import { redirect } from 'next/navigation';
import { config } from '@/config';

import { Header } from '@/components/Header';
import { StartCall } from '@/components/StartCall';

export default function IndexPage() {
  const handleSubmit = async () => {
    'use server';

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily/room`;
    const response = await fetch(url, { method: 'POST', cache: 'no-store' });
    const { name } = await response.json();
    redirect(`/${name}`);
  };

  return (
    <div className="flex h-full flex-col">
      <Header inCall={false} />
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
        <h2 className="text-2xl font-bold leading-3">{config.name}</h2>
        <p className="w-full px-4 text-center leading-7 md:max-w-[600px] md:px-0">
          {config.description}
        </p>
        <form action={handleSubmit}>
          <StartCall />
        </form>
      </div>
    </div>
  );
}
