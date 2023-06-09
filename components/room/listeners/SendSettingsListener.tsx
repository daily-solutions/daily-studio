import { useCallback } from 'react';
import { useSendQualityState } from '@/states/sendQualityState';
import { DailyEventObjectNetworkQualityEvent } from '@daily-co/daily-js';
import { useDailyEvent } from '@daily-co/daily-react';

import { useSendSettingsQuality } from '@/hooks/useSendSettings';

export function SendSettingsListener() {
  const [defaultQuality] = useSendQualityState();
  const { updateQuality } = useSendSettingsQuality();

  useDailyEvent(
    'network-quality-change',
    useCallback(
      async (ev: DailyEventObjectNetworkQualityEvent) => {
        if (defaultQuality !== 'auto') return;

        const { threshold } = ev;
        switch (threshold) {
          case 'very-low':
            await updateQuality('low');
            break;
          case 'low':
            await updateQuality('medium');
            break;
          case 'good':
            await updateQuality('high');
            break;
        }
      },
      [defaultQuality, updateQuality]
    )
  );

  // disables sending high quality video when screen sharing
  const handleSendQualityOnScreenShare = useCallback(
    async (ev) => {
      if (defaultQuality !== 'auto') return;
      if (ev.action === 'local-screen-share-started')
        await updateQuality('medium');
      else await updateQuality('high');
    },
    [defaultQuality, updateQuality]
  );

  useDailyEvent('local-screen-share-started', handleSendQualityOnScreenShare);
  useDailyEvent('local-screen-share-stopped', handleSendQualityOnScreenShare);

  return null;
}
