import React, { useCallback, useState } from 'react';
import {
  useDaily,
  useLocalSessionId,
  usePermissions,
} from '@daily-co/daily-react';

import { Card } from '@/components/ui/card';
import { NameSetup } from '@/components/call/haircheck/nameSetup';
import { Setup } from '@/components/call/haircheck/setup';
import { Loader } from '@/components/loader';

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
    [daily, hasPresence]
  );

  if (!localSessionId) return <Loader showHeader={false} />;

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card className="w-full sm:w-[35dvw] 2xl:w-[25dvw]">
        {state === 'haircheck' ? (
          <Setup />
        ) : (
          <NameSetup onContinue={handleContinue} />
        )}
      </Card>
    </div>
  );
}
