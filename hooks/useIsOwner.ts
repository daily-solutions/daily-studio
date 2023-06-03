import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

export const useIsOwner = (sessionId?: string) => {
  const localSessionId = useLocalSessionId();

  return useParticipantProperty(sessionId ?? localSessionId, 'owner');
};
