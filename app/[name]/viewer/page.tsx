import React from 'react';
import { ViewLayout } from 'components/ViewLayout';

import { DailyClientProvider } from '@/components/Providers';

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
