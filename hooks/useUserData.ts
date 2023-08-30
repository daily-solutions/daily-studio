import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

interface UserData {
  onStage?: boolean;
  acceptedToJoin?: boolean;
}

export const useUserData = (sessionId: string | null = null) => {
  const localSessionId = useLocalSessionId();

  const userData = useParticipantProperty(
    sessionId ?? localSessionId,
    'userData',
  );

  return userData as UserData;
};
