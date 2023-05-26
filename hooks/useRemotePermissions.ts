import { useParticipantProperty } from '@daily-co/daily-react';

export const useRemotePermissions = (sessionId: string) => {
  const permissions = useParticipantProperty(sessionId, 'permissions');

  const canSendAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('audio');
  const canSendVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('video');
  const canSendCustomAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('customAudio');
  const canSendCustomVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('customVideo');
  const canSendScreenAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('screenAudio');
  const canSendScreenVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('screenVideo');

  return {
    canSendAudio: Boolean(canSendAudio),
    canSendCustomAudio: Boolean(canSendCustomAudio),
    canSendCustomVideo: Boolean(canSendCustomVideo),
    canSendScreenAudio: Boolean(canSendScreenAudio),
    canSendScreenVideo: Boolean(canSendScreenVideo),
    canSendVideo: Boolean(canSendVideo),
    hasPresence: Boolean(permissions?.hasPresence),
    permissions,
  };
};
