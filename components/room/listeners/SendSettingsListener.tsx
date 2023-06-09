import { useCallback } from 'react';
import { useSendQualityState } from '@/states/sendQualityState';
import {
  DailyEventObjectCpuLoadEvent,
  DailyEventObjectNetworkQualityEvent,
} from '@daily-co/daily-js';
import { useDailyEvent } from '@daily-co/daily-react';

import { useSendSettingsQuality } from '@/hooks/useSendSettings';

export function SendSettingsListener() {
  const [defaultQuality] = useSendQualityState();
  const { updateQuality } = useSendSettingsQuality();

  const handleNetworkQualityChange = useCallback(
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
  );

  // disables sending high quality video when screen sharing
  const handleOnScreenShare = useCallback(
    async (ev) => {
      if (defaultQuality !== 'auto') return;

      if (ev.action === 'local-screen-share-started')
        await updateQuality('medium');
      else await updateQuality('high');
    },
    [defaultQuality, updateQuality]
  );

  const handleCPULoadChange = useCallback(
    async (ev: DailyEventObjectCpuLoadEvent) => {
      if (defaultQuality !== 'auto') return;

      const { cpuLoadState, cpuLoadStateReason } = ev;

      switch (cpuLoadState) {
        case 'high':
          await updateQuality(
            cpuLoadStateReason === 'encode' ? 'low' : 'medium'
          );
          break;
        case 'low':
          await updateQuality('high');
          break;
        default:
          break;
      }
    },
    [defaultQuality, updateQuality]
  );

  useDailyEvent('cpu-load-change', handleCPULoadChange);
  useDailyEvent('network-quality-change', handleNetworkQualityChange);
  useDailyEvent('local-screen-share-started', handleOnScreenShare);
  useDailyEvent('local-screen-share-stopped', handleOnScreenShare);

  return null;
}
