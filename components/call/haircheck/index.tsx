import React, { useCallback, useEffect, useState } from 'react';
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
  const [userName, hasPresence] = useParticipantProperty(
    localSessionId as string,
    ['user_name', 'permissions.hasPresence']
  );
  const daily = useDaily();

  useEffect(() => {
    if (!localSessionId) return;

    if (userName) setState('haircheck');
  }, [localSessionId, userName]);

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
      <Card className="w-full sm:w-[60dvh]">
        {state === 'haircheck' ? (
          <Setup />
        ) : (
          <NameSetup onContinue={handleContinue} />
        )}
      </Card>
    </div>
  );
}
