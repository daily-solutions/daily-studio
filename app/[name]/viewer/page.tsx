import React from 'react';

import { Call } from '@/components/Call';
import { DailyClientProvider } from '@/components/Room/DailyClientProvider';

export default function ViewerPage({
  params: { name },
}: {
  params: { name: string };
}) {
  return (
    <DailyClientProvider roomName={name}>
      <Call />
    </DailyClientProvider>
  );
}
