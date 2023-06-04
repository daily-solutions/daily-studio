import { useCallback, useEffect } from 'react';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useParticipants } from '@/hooks/useParticipants';

export const useReceiveSettings = () => {
  const daily = useDaily();

  const localSessionId = useLocalSessionId();
  const isOwner = useIsOwner();
  const { participantIds, waitingParticipantIds } = useParticipants();

  const updateReceiveSettings = useCallback(async () => {
    if (!daily || !isOwner) return;

    const receiveSettings = await daily.getReceiveSettings();

    const updatedReceiveSettings = {};

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

    waitingParticipantIds.forEach((participantId) => {
      if (
        participantId === localSessionId ||
        0 === receiveSettings?.[participantId]?.video?.layer
      )
        return;
      updatedReceiveSettings[participantId] = { video: { layer: 0 } };
    });

    if (Object.keys(updatedReceiveSettings).length === 0) return;

    console.log('updatedReceiveSettings', updatedReceiveSettings);

    await daily.updateReceiveSettings(updatedReceiveSettings);
  }, [daily, isOwner, localSessionId, participantIds, waitingParticipantIds]);

  useEffect(() => {
    updateReceiveSettings();
  }, [updateReceiveSettings]);

  return {};
};
