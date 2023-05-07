import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

export function Audio() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const audio = useParticipantProperty(localSessionId as string, 'audio');

  return (
    <TrayButton
      muted={!audio}
      onClick={() => daily?.setLocalAudio(!audio)}
      text={audio ? 'Mute' : 'Unmute'}
      icon={audio ? 'micOn' : 'micOff'}
    />
  );
}
