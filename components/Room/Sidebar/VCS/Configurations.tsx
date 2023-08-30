import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/useToast';
import { Params } from '@daily-co/daily-vcs-web';

import { Asset } from '@/types/asset';
import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useSyncParams } from '@/hooks/useSyncParams';

interface Config {
  name: string;
  config: any;
}

export function Configurations() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const { updateParams } = useSyncParams();
  const [, updateMeetingSessionData] =
    useMeetingSessionState<MeetingSessionState>();
  const { toast } = useToast();

  useEffect(() => {
    const ilsConfig = localStorage.getItem('ils-config');
    if (ilsConfig) setConfigs(Object.values(JSON.parse(ilsConfig)));
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const ilsConfig = localStorage.getItem('ils-config');
      if (ilsConfig) setConfigs(Object.values(JSON.parse(ilsConfig)));
    };
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleApply = useCallback(
    (config: { params: Params; assets: Asset[] }) => {
      const { params, assets } = config;
      if (params) updateParams(params, 'replace');
      if (assets) updateMeetingSessionData({ assets });
      toast({
        title: 'Applied configuration',
        description: 'Configuration is applied to the meeting',
      });
    },
    [toast, updateMeetingSessionData, updateParams],
  );

  if (configs.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-y-4">
      <h3 className="text-sm font-semibold">Configurations</h3>
      <div className="flex flex-col gap-y-2">
        {configs.map((config) => (
          <div key={config.name} className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{config.name}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApply(config.config)}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
