import React, { useCallback, useState } from 'react';
import { Card } from '@/ui/Card';
import {
  useDaily,
  useLocalSessionId,
  usePermissions,
} from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';
import { NameSetup } from '@/components/Room/Haircheck/NameSetup';
import { Setup } from '@/components/Room/Haircheck/Setup';

export function Haircheck() {
  const [state, setState] = useState<'setup' | 'haircheck'>('setup');
  const localSessionId = useLocalSessionId();
  const { hasPresence } = usePermissions();
  const daily = useDaily();

  const handleContinue = useCallback(
    async (userName: string) => {
      if (!daily) return;

      await daily.setUserName(userName);
      if (hasPresence) setState('haircheck');
      else await daily.join();
    },
    [daily, hasPresence],
  );

  if (!localSessionId) return <Loader showHeader={false} />;

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center p-4 sm:p-0">
      <Card className="w-full sm:w-[70dvw] md:w-[50dvw] lg:w-[45dvw] xl:w-[30dvw] 2xl:w-[25dvw]">
        {state === 'haircheck' ? (
          <Setup />
        ) : (
          <NameSetup onContinue={handleContinue} />
        )}
      </Card>
    </div>
  );
}
