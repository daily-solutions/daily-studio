import React from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/ui/Button';

import { siteConfig } from '@/config/site';
import { Header } from '@/components/Header';

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
        <h2 className="text-2xl font-bold leading-3">{siteConfig.name}</h2>
        <p className="leading-7">{siteConfig.description}</p>
        <form action={handleSubmit}>
          <Button size="sm" type="submit">
            Start call
          </Button>
        </form>
      </div>
    </div>
  );
}
