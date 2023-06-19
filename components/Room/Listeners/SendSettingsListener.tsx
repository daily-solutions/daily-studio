import { useCallback, useEffect } from 'react';
import {
  useNetwork,
  useScreenShare,
  useSendSettings,
} from '@daily-co/daily-react';

import { useCPULoad } from '@/hooks/useCPULoad';

type SendSettingsQuality = 'low' | 'medium' | 'high';

export function SendSettingsListener() {
  const { sendSettings, updateSendSettings } = useSendSettings();
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

    if (sendSettings?.video?.maxQuality === videoQuality) return;
    await updateSendSettings({
      video: {
        maxQuality: videoQuality,
      },
    });
  }, [
    cpuLoadState,
    cpuLoadStateReason,
    isSharingScreen,
    threshold,
    updateSendSettings,
    sendSettings?.video?.maxQuality,
  ]);

  useEffect(() => {
    handleSendVideoQuality();
  }, [handleSendVideoQuality]);

  return null;
}
