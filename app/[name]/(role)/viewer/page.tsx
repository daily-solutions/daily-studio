import React from 'react';

import { DailyClientProvider } from '@/components/Providers';
import { ViewLayout } from '@/components/ViewLayout';

export default function ViewerPage({
  params: { name },
}: {
  params: { name: string };
}) {
  return (
    <DailyClientProvider roomName={name}>
      <ViewLayout />
    </DailyClientProvider>
  );
}
