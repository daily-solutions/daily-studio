'use client';

import React, { useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Loader } from '@/components/loader';

interface DailyClientProps {
  roomName: string;
  token?: string;
  requiresToken?: boolean;
}

export function DailyClientProvider({
  roomName,
  children,
  token = '',
  requiresToken = false,
}: React.PropsWithChildren<DailyClientProps>) {
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
        sendSettings: {
          video: 'quality-optimized',
        },
        dailyConfig: {
          useDevicePreferenceCookies: true,
        },
        subscribeToTracksAutomatically: false,
      });
    } catch {
      newCallObject = DailyIframe.getCallInstance();
    }
    setCallObject(newCallObject);

    // attach callObject to window
    window['callObject'] = newCallObject;

    newCallObject.preAuth({ url, token });
  }, [callObject, requiresToken, roomName, token]);

  if (!callObject) return <Loader />;

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
