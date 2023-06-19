import { useCallback, useEffect } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import {
  DailyEventObject,
  DailyEventObjectCpuLoadEvent,
  DailyEventObjectNetworkQualityEvent,
} from '@daily-co/daily-js';
import { useSendSettings, useThrottledDailyEvent } from '@daily-co/daily-react';

import { useParticipants } from '@/hooks/useParticipants';
import { VIDEO_QUALITY_LAYERS } from '@/components/Room/Listeners/ReceiveSettingsListener';

export function SendSettingsListener() {
  const { sendSettings, updateSendSettings } = useSendSettings();

  const [{ send }, setVideoLayer] = useVideoLayer();

  const { participantIds } = useParticipants();

  const handleEvents = useCallback(
    (
      events: (
        | DailyEventObjectCpuLoadEvent
        | DailyEventObjectNetworkQualityEvent
        | DailyEventObject
      )[]
    ) => {
      events.forEach((ev) => {
        switch (ev.action) {
          case 'network-quality-change':
            const { threshold } = ev;
            const networkQualityLayer =
              threshold === 'good'
                ? VIDEO_QUALITY_LAYERS.HIGH
                : threshold === 'low'
                ? VIDEO_QUALITY_LAYERS.MEDIUM
                : VIDEO_QUALITY_LAYERS.LOW;

            setVideoLayer((prev) => {
              if (prev.send.layerBasedOnNetwork === networkQualityLayer) {
                return prev;
              }
              return {
                ...prev,
                send: { ...prev.send, networkQualityLayer },
              };
            });
            break;
          case 'cpu-load-change':
            const { cpuLoadState, cpuLoadStateReason } = ev;
            const cpuLoadLayer =
              cpuLoadState === 'low'
                ? VIDEO_QUALITY_LAYERS.HIGH
                : cpuLoadStateReason === 'decode'
                ? VIDEO_QUALITY_LAYERS.MEDIUM
                : VIDEO_QUALITY_LAYERS.LOW;

            setVideoLayer((prev) => {
              if (prev.send.layerBasedOnCPU === cpuLoadLayer) {
                return prev;
              }
              return { ...prev, send: { ...prev.send, cpuLoadLayer } };
            });
            break;
          case 'local-screen-share-started':
            setVideoLayer((prev) => {
              return {
                ...prev,
                send: { ...prev.send, layerBasedOnScreenShare: 1 },
              };
            });
            break;
          case 'local-screen-share-stopped':
            setVideoLayer((prev) => {
              return {
                ...prev,
                send: { ...prev.send, layerBasedOnScreenShare: 2 },
              };
            });
            break;
          default:
            break;
        }
      });
    },
    [setVideoLayer]
  );

  useThrottledDailyEvent(
    [
      'network-quality-change',
      'cpu-load-change',
      'local-screen-share-started',
      'local-screen-share-stopped',
    ],
    handleEvents
  );

  useEffect(() => {
    const participantCount = participantIds.length;
    const participantCountLayer =
      participantCount < 5
        ? VIDEO_QUALITY_LAYERS.HIGH
        : participantCount < 10
        ? VIDEO_QUALITY_LAYERS.MEDIUM
        : VIDEO_QUALITY_LAYERS.LOW;

    setVideoLayer((prev) => {
      if (prev.send.layerBasedOnParticipantCount === participantCountLayer) {
        return prev;
      }
      return { ...prev, send: { ...prev.send, participantCountLayer } };
    });
  }, [participantIds, setVideoLayer]);

  const handleSendVideoQuality = useCallback(async () => {
    const layers = [
      send.layerBasedOnCPU,
      send.layerBasedOnNetwork,
      send.layerBasedOnParticipantCount,
      send.layerBasedOnScreenShare,
    ];
    const layer = Math.min(...layers);

    if (sendSettings?.video?.maxQuality === layer) return;

    const maxQuality = layer === 2 ? 'high' : layer === 1 ? 'medium' : 'low';
    await updateSendSettings({ video: { maxQuality } });
  }, [
    send.layerBasedOnCPU,
    send.layerBasedOnNetwork,
    send.layerBasedOnParticipantCount,
    send.layerBasedOnScreenShare,
    sendSettings?.video?.maxQuality,
    updateSendSettings,
  ]);

  useEffect(() => {
    handleSendVideoQuality();
  }, [handleSendVideoQuality]);

  return null;
}
