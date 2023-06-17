import { useCallback, useEffect } from 'react';
import { useNetwork, useScreenShare } from '@daily-co/daily-react';

import { useCPULoad } from '@/hooks/useCPULoad';
import {
  SendSettingsQuality,
  useSendSettingsQuality,
} from '@/hooks/useSendSettings';

export function SendSettingsListener() {
  const { quality, updateQuality } = useSendSettingsQuality();
  const { threshold } = useNetwork();
  const { isSharingScreen } = useScreenShare();
  const { cpuLoadState, cpuLoadStateReason } = useCPULoad();

  const handleSendVideoQuality = useCallback(async () => {
    let videoQuality: SendSettingsQuality = 'high';

    /*
     * there are three cases of video quality here
     * 1. low
     *    a. when network threshold is very-low
     *    b. when cpu load is high & reason is encode
     * 2. medium
     *    a. when the local participant is sharing the screen
     *    b. when threshold is low.
     *    c. when cpu load is high
     * 3. high - for rest of the cases.
     */

    if (
      threshold === 'very-low' ||
      (cpuLoadState === 'high' && cpuLoadStateReason === 'encode')
    ) {
      videoQuality = 'low';
    } else if (
      threshold === 'low' ||
      isSharingScreen ||
      cpuLoadState === 'high'
    ) {
      videoQuality = 'medium';
    }

    if (quality === videoQuality) return;
    await updateQuality(videoQuality);
  }, [
    cpuLoadState,
    cpuLoadStateReason,
    isSharingScreen,
    quality,
    threshold,
    updateQuality,
  ]);

  useEffect(() => {
    handleSendVideoQuality();
  }, [handleSendVideoQuality]);

  return null;
}
