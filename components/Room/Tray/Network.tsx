import { useEffect, useMemo, useState } from 'react';
import { config } from '@/config';
import { Card } from '@/ui/Card';
import { Icon } from '@/ui/Icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { TrayButton } from '@/ui/TrayButton';
import { DailyNetworkStats } from '@daily-co/daily-js';
import { useDaily, useNetwork } from '@daily-co/daily-react';

function NetworkPopover() {
  const daily = useDaily();
  const { threshold } = useNetwork();

  const [stats, setStats] = useState<DailyNetworkStats['stats'] | undefined>(
    undefined,
  );

  useEffect(() => {
    const updateStats = async () => {
      const networkStats = await daily?.getNetworkStats();
      setStats(networkStats?.stats);
    };
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [daily]);

  const { downloadKbs, uploadKbs } = useMemo(() => {
    const { latest } = stats ?? {};
    const videoRecvBitsPerSecond = latest?.videoRecvBitsPerSecond ?? 0;
    const audioRecvBitsPerSecond = latest?.audioRecvBitsPerSecond ?? 0;

    const videoSendBitsPerSecond = latest?.videoSendBitsPerSecond ?? 0;
    const audioSendBitsPerSecond = latest?.audioSendBitsPerSecond ?? 0;

    return {
      downloadKbs: Math.round(
        (videoRecvBitsPerSecond + audioRecvBitsPerSecond) / 1000,
      ),
      uploadKbs: Math.round(
        (videoSendBitsPerSecond + audioSendBitsPerSecond) / 1000,
      ),
    };
  }, [stats]);

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
  if (!config?.options?.enable_network_ui) return null;

  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <TrayButton text="Network" icon="network" />
      </PopoverTrigger>
      <PopoverContent className="min-w-max">
        <NetworkPopover />
      </PopoverContent>
    </Popover>
  );
}
