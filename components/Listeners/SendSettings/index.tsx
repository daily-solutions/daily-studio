import { useCallback, useEffect, useRef } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { useDaily, useSendSettings } from '@daily-co/daily-react';

import { CPULoadListener } from '@/components/Listeners/SendSettings/CPULoadListener';
import { NetworkThresholdListener } from '@/components/Listeners/SendSettings/NetworkThresholdListener';
import { ScreenShareListener } from '@/components/Listeners/SendSettings/ScreenShareListener';

export function SendSettingsListener() {
  const lastSendSettingsMaxQualityRef = useRef<number>(2);

  const daily = useDaily();
  const { updateSendSettings } = useSendSettings();
  const [{ send }] = useVideoLayer();

  const handleSendVideoQuality = useCallback(async () => {
    if (!daily || daily.meetingState() !== 'joined-meeting') return;

    const layer = Math.min(
      send.layerBasedOnCPU,
      send.layerBasedOnNetwork,
      send.layerBasedOnScreenShare,
    );

    if (lastSendSettingsMaxQualityRef.current === layer) return;

    const maxQuality = layer === 2 ? 'high' : layer === 1 ? 'medium' : 'low';
    await updateSendSettings({ video: { maxQuality } });
    lastSendSettingsMaxQualityRef.current = layer;
  }, [
    daily,
    send.layerBasedOnCPU,
    send.layerBasedOnNetwork,
    send.layerBasedOnScreenShare,
    updateSendSettings,
  ]);

  useEffect(() => {
    handleSendVideoQuality();
  }, [handleSendVideoQuality]);

  return (
    <>
      <CPULoadListener />
      <NetworkThresholdListener />
      <ScreenShareListener />
    </>
  );
}
