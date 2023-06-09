import { useCallback } from 'react';
import {
  DailyEventObjectCpuLoadEvent,
  DailyEventObjectNetworkQualityEvent,
} from '@daily-co/daily-js';
import { useDailyEvent } from '@daily-co/daily-react';

import { useSendSettingsQuality } from '@/hooks/useSendSettings';

export function SendSettingsListener() {
  const { updateQuality } = useSendSettingsQuality();

  const handleNetworkQualityChange = useCallback(
    async (ev: DailyEventObjectNetworkQualityEvent) => {
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
    [updateQuality]
  );

  // disables sending high quality video when screen sharing
  const handleOnScreenShare = useCallback(
    async (ev) => {
      if (ev.action === 'local-screen-share-started')
        await updateQuality('medium');
      else await updateQuality('high');
    },
    [updateQuality]
  );

  const handleCPULoadChange = useCallback(
    async (ev: DailyEventObjectCpuLoadEvent) => {
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
    [updateQuality]
  );

  useDailyEvent('cpu-load-change', handleCPULoadChange);
  useDailyEvent('network-quality-change', handleNetworkQualityChange);
  useDailyEvent('local-screen-share-started', handleOnScreenShare);
  useDailyEvent('local-screen-share-stopped', handleOnScreenShare);

  return null;
}
