'use client';

import React, { useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Icons } from '@/components/icons';

export function DailyClientProvider({
  roomName,
  token = '',
  children,
  requiresToken = false,
}: React.PropsWithChildren<{
  roomName: string;
  token?: string;
  requiresToken?: boolean;
}>) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  useEffect(() => {
    if (callObject || !roomName || (requiresToken && !token)) return;

    const url = `https://${process.env.NEXT_PUBLIC_DAILY_DOMAIN}.daily.co/${roomName}`;
    let newCallObject: DailyCall | null = null;
    try {
      newCallObject = DailyIframe.createCallObject({
        url,
        token,
        strictMode: true,
        dailyConfig: {
          keepCamIndicatorLightOn: true,
          useDevicePreferenceCookies: true,
        },
      });
    } catch {
      newCallObject = DailyIframe.getCallInstance();
    }
    setCallObject(newCallObject);
    newCallObject.preAuth({ url, token });
  }, [callObject, requiresToken, roomName, token]);

  if (!callObject)
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
