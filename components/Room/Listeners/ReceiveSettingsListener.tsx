import { useCallback, useEffect } from 'react';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { useParticipants } from '@/hooks/useParticipants';

export function ReceiveSettingsListener() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const { participantIds, waitingParticipantIds } = useParticipants();

  const updateReceiveSettings = useCallback(async () => {
    if (!daily) return;

    const updatedReceiveSettings = {};
    const receiveSettings = await daily.getReceiveSettings();

    const layer =
      participantIds.length < 5 ? 2 : participantIds.length < 10 ? 1 : 0;

    const updateSettingsForParticipant = (
      participantId: string,
      layer: 0 | 1 | 2
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
  }, [daily, localSessionId, participantIds, waitingParticipantIds]);

  useEffect(() => {
    updateReceiveSettings();
  }, [updateReceiveSettings]);

  return null;
}
