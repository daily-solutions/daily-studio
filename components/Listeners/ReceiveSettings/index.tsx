import { useCallback, useEffect } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { DailyReceiveSettings } from '@daily-co/daily-js';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { useStage } from '@/hooks/useStage';
import { CPULoadListener } from '@/components/Listeners/ReceiveSettings/CPULoadListener';
import { NetworkThresholdListener } from '@/components/Listeners/ReceiveSettings/NetworkThresholdListener';
import { ParticipantsListener } from '@/components/Listeners/ReceiveSettings/ParticipantsListener';

export function ReceiveSettingsListener() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const { participantIds, waitingParticipantIds } = useStage();

  const [{ receive }] = useVideoLayer();

  const updateReceiveSettings = useCallback(async () => {
    if (!daily || daily.meetingState() !== 'joined-meeting') return;

    const updatedReceiveSettings: DailyReceiveSettings = {};
    const receiveSettings = await daily.getReceiveSettings();

    const layer = Math.min(
      receive.layerBasedOnCPU,
      receive.layerBasedOnNetwork,
      receive.layerBasedOnParticipantCount,
    );

    const updateSettingsForParticipant = (
      participantId: string,
      layer: number,
    ) => {
      if (participantId === localSessionId) return;
      updatedReceiveSettings[participantId] = { video: { layer } };
    };

    participantIds.forEach((participantId) =>
      updateSettingsForParticipant(participantId, layer),
    );

    waitingParticipantIds.forEach((participantId) =>
      updateSettingsForParticipant(participantId, 0),
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

  return (
    <>
      <CPULoadListener />
      <NetworkThresholdListener />
      <ParticipantsListener />
    </>
  );
}
