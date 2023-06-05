import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

interface Props {
  disabled?: boolean;
}

export function Audio({ disabled = false }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const audio = useParticipantProperty(localSessionId, 'audio');

  const { canSendAudio } = usePermissions();

  if (!canSendAudio) return null;

  return (
    <TrayButton
      muted={!audio}
      onClick={() => daily?.setLocalAudio(!audio)}
      text={audio ? 'Mute' : 'Unmute'}
      icon={audio ? 'micOn' : 'micOff'}
      disabled={disabled}
    />
  );
}
