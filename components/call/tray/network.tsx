import { useEffect, useMemo, useState } from 'react';
import { DailyNetworkStats } from '@daily-co/daily-js';
import { useNetwork } from '@daily-co/daily-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icon } from '@/components/icons';

function NetworkPopover() {
  const { getStats, threshold } = useNetwork();

  const [stats, setStats] = useState<DailyNetworkStats['stats'] | undefined>(
    undefined
  );

  useEffect(() => {
    const updateStats = async () => {
      setStats(await getStats());
    };
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [getStats]);

  const downloadKbs = useMemo(
    () => Math.round((stats?.latest?.videoRecvBitsPerSecond ?? 0) / 1000),
    [stats?.latest?.videoRecvBitsPerSecond]
  );
  const uploadKbs = useMemo(
    () => Math.round((stats?.latest?.videoSendBitsPerSecond ?? 0) / 1000),
    [stats?.latest?.videoSendBitsPerSecond]
  );

  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <Card className="flex w-full flex-col justify-between gap-y-1 bg-muted p-4">
        <h3 className="text-sm font-bold">Packet loss</h3>
        <p>Your network is {threshold}</p>
      </Card>
      <Card className="flex w-full flex-col justify-between gap-y-1 bg-muted p-4">
        <div className="flex items-center gap-x-1">
          <Icon icon="download" className="h-4 w-4" />
          <h3 className="text-sm font-bold">Download rate</h3>
        </div>
        <p className="text-lg">{downloadKbs} kb/s</p>
      </Card>
      <Card className="flex w-full flex-col justify-between gap-y-1 bg-muted p-4">
        <div className="flex items-center gap-x-1">
          <Icon icon="upload" className="h-4 w-4" />
          <h3 className="text-sm font-bold">Upload rate</h3>
        </div>
        <p className="text-lg">{uploadKbs} kb/s</p>
      </Card>
    </div>
  );
}

export function Network() {
  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="network" className="h-6 w-6" />
            <p className="text-xs">Network</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-max">
        <NetworkPopover />
      </PopoverContent>
    </Popover>
  );
}
