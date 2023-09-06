'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';

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
  const pathname = usePathname();
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  useEffect(() => {
    const handleCreateCallObject = async () => {
      if (callObject || !roomName || (requiresToken && !token)) return;

      const role = pathname.split('/').pop();

      const url = `https://${process.env.NEXT_PUBLIC_DAILY_DOMAIN}.daily.co/${roomName}`;
      let newCallObject: DailyCall | null = null;
      try {
        newCallObject = DailyIframe.createCallObject({
          url,
          token,
          strictMode: true,
          sendSettings: {
            video: role === 'producer' ? 'quality-optimized' : 'default-video',
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
      (window as any)['callObject'] = newCallObject;
      await newCallObject.preAuth({ url, token });
    };

    handleCreateCallObject();
  }, [callObject, requiresToken, roomName, pathname, token]);

  if (!callObject) return <Loader />;

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
