import { useCallback, useEffect } from 'react';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';

import { useParticipants } from '@/hooks/useParticipants';

export function ReceiveSettingsListener() {
  const daily = useDaily();

  const localSessionId = useLocalSessionId();
  const { participantIds } = useParticipants();

  const updateReceiveSettings = useCallback(async () => {
    if (!daily) return;

    const updatedReceiveSettings = {};
    const receiveSettings = await daily.getReceiveSettings();

    const layer =
      participantIds.length < 5 ? 2 : participantIds.length < 10 ? 1 : 0;

    participantIds.forEach((participantId) => {
      if (
        participantId === localSessionId ||
        layer === receiveSettings?.[participantId]?.video?.layer
      )
        return;

      updatedReceiveSettings[participantId] = { video: { layer } };
    });

    Object.keys(receiveSettings).forEach((user) => {
      if (user === 'base' || user === '*') return;

      if (!participantIds.includes(user)) {
        updatedReceiveSettings[user] = { video: { layer: 0 } };
      }
    });

    if (Object.keys(updatedReceiveSettings).length === 0) return;

    await daily.updateReceiveSettings(updatedReceiveSettings);
  }, [daily, localSessionId, participantIds]);

  useEffect(() => {
    updateReceiveSettings();
  }, [updateReceiveSettings]);

  return null;
}
