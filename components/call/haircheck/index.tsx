import React, { useCallback, useState } from 'react';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { Card } from '@/components/ui/card';
import { NameSetup } from '@/components/call/haircheck/nameSetup';
import { Setup } from '@/components/call/haircheck/setup';
import { Icons } from '@/components/icons';

export function Haircheck() {
  const [state, setState] = useState<'setup' | 'haircheck'>('setup');
  const localSessionId = useLocalSessionId();
  const hasPresence = useParticipantProperty(
    localSessionId as string,
    'permissions.hasPresence'
  );
  const daily = useDaily();

  const handleContinue = useCallback(
    (userName: string) => {
      daily?.setUserName(userName);
      if (hasPresence) setState('haircheck');
      else daily?.join();
    },
    [daily, hasPresence]
  );

  if (!localSessionId) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center bg-muted">
      <Card className="w-full sm:w-[60dvh] lg:w-[45dvh]">
        {state === 'haircheck' ? (
          <Setup />
        ) : (
          <NameSetup onContinue={handleContinue} />
        )}
      </Card>
    </div>
  );
}
