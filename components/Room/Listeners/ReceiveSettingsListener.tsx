import { useCallback, useEffect } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import {
  DailyEventObjectCpuLoadEvent,
  DailyEventObjectNetworkQualityEvent,
} from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useThrottledDailyEvent,
} from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { useStage } from '@/hooks/useStage';

export enum VIDEO_QUALITY_LAYERS {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export function ReceiveSettingsListener() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const { participantIds, waitingParticipantIds } = useStage();

  const [{ receive }, setVideoLayer] = useVideoLayer();

  const handleEvent = useCallback(
    (
      events: (
        | DailyEventObjectCpuLoadEvent
        | DailyEventObjectNetworkQualityEvent
      )[]
    ) => {
      events.forEach((ev) => {
        if (ev.action === 'network-quality-change') {
          const { threshold } = ev;
          const networkQualityLayer =
            threshold === 'good'
              ? VIDEO_QUALITY_LAYERS.HIGH
              : threshold === 'low'
              ? VIDEO_QUALITY_LAYERS.MEDIUM
              : VIDEO_QUALITY_LAYERS.LOW;

          setVideoLayer((prev) => {
            if (prev.receive.layerBasedOnNetwork === networkQualityLayer) {
              return prev;
            }
            return {
              ...prev,
              receive: { ...prev.receive, networkQualityLayer },
            };
          });
        } else if (ev.action === 'cpu-load-change') {
          const { cpuLoadState, cpuLoadStateReason } = ev;
          const cpuLoadLayer =
            cpuLoadState === 'low'
              ? VIDEO_QUALITY_LAYERS.HIGH
              : cpuLoadStateReason === 'decode'
              ? VIDEO_QUALITY_LAYERS.MEDIUM
              : VIDEO_QUALITY_LAYERS.LOW;

          setVideoLayer((prev) => {
            if (prev.receive.layerBasedOnCPU === cpuLoadLayer) {
              return prev;
            }
            return { ...prev, receive: { ...prev.receive, cpuLoadLayer } };
          });
        }
      });
    },
    [setVideoLayer]
  );

  useThrottledDailyEvent(
    ['network-quality-change', 'cpu-load-change'],
    handleEvent
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
      if (prev.receive.layerBasedOnParticipantCount === participantCountLayer) {
        return prev;
      }
      return { ...prev, receive: { ...prev.receive, participantCountLayer } };
    });
  }, [participantIds, setVideoLayer]);

  const updateReceiveSettings = useCallback(async () => {
    if (!daily || daily.meetingState() !== 'joined-meeting') return;

    const updatedReceiveSettings = {};
    const receiveSettings = await daily.getReceiveSettings();

    const layers = [
      receive.layerBasedOnCPU,
      receive.layerBasedOnNetwork,
      receive.layerBasedOnParticipantCount,
    ];

    const layer = Math.min(...layers);

    const updateSettingsForParticipant = (participantId, layer) => {
      if (participantId === localSessionId) return;
      updatedReceiveSettings[participantId] = { video: { layer } };
    };

    participantIds.forEach((participantId) =>
      updateSettingsForParticipant(participantId, layer)
    );

    waitingParticipantIds.forEach((participantId) =>
      updateSettingsForParticipant(participantId, 0)
    );

    if (
      Object.keys(updatedReceiveSettings).length === 0 ||
      dequal(receiveSettings, updatedReceiveSettings)
    ) {
      return;
    }

    await daily.updateReceiveSettings(updatedReceiveSettings);
  }, [
    daily,
    localSessionId,
    participantIds,
    receive.layerBasedOnCPU,
    receive.layerBasedOnNetwork,
    receive.layerBasedOnParticipantCount,
    waitingParticipantIds,
  ]);

  useEffect(() => {
    updateReceiveSettings();
  }, [updateReceiveSettings]);

  return null;
}
