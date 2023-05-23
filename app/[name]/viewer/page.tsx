import React from 'react';

import { Call } from '@/components/call';
import { DailyClientProvider } from '@/components/room/DailyClientProvider';

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
