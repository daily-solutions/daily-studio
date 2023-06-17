import { useCallback, useEffect } from 'react';
import { useDaily, useLocalSessionId, useNetwork } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { useCPULoad } from '@/hooks/useCPULoad';
import { useParticipants } from '@/hooks/useParticipants';

export enum VIDEO_QUALITY_LAYERS {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export function ReceiveSettingsListener() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const { participantIds, waitingParticipantIds } = useParticipants();

  const { threshold } = useNetwork();
  const { cpuLoadState, cpuLoadStateReason } = useCPULoad();

  const calculateOptimalLayer = useCallback(() => {
    const isCPULoadLow = cpuLoadState === 'low';
    const isCPULoadHigh = cpuLoadState === 'high';
    const isCPULoadDueToDecode = cpuLoadStateReason === 'decode';

    const isThresholdGood = threshold === 'good';
    const isThresholdLow = threshold === 'low';

    let optimalLayer: VIDEO_QUALITY_LAYERS = VIDEO_QUALITY_LAYERS.LOW;

    if (participantIds.length < 5) {
      if (isCPULoadLow && isThresholdGood) {
        optimalLayer = VIDEO_QUALITY_LAYERS.HIGH;
      } else if (isThresholdLow) {
        optimalLayer = VIDEO_QUALITY_LAYERS.MEDIUM;
      } else if (isCPULoadHigh) {
        optimalLayer = isCPULoadDueToDecode
          ? VIDEO_QUALITY_LAYERS.LOW
          : VIDEO_QUALITY_LAYERS.MEDIUM;
      }
    } else if (participantIds.length < 10) {
      if (isCPULoadLow && isThresholdGood) {
        optimalLayer = VIDEO_QUALITY_LAYERS.MEDIUM;
      }
    }

    return optimalLayer;
  }, [cpuLoadState, cpuLoadStateReason, participantIds.length, threshold]);

  const updateReceiveSettings = useCallback(async () => {
    if (!daily) return;

    const updatedReceiveSettings = {};
    const receiveSettings = await daily.getReceiveSettings();

    const layer = calculateOptimalLayer();

    const updateSettingsForParticipant = (
      participantId: string,
      layer: VIDEO_QUALITY_LAYERS
    ) => {
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
    calculateOptimalLayer,
    daily,
    localSessionId,
    participantIds,
    waitingParticipantIds,
  ]);

  useEffect(() => {
    updateReceiveSettings();
  }, [updateReceiveSettings]);

  return null;
}
