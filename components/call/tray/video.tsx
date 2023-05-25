import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

export function Video() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const video = useParticipantProperty(localSessionId, 'video');

  return (
    <TrayButton
      muted={!video}
      onClick={() => daily?.setLocalVideo(!video)}
      text={video ? 'Turn off' : 'Turn on'}
      icon={video ? 'videoOn' : 'videoOff'}
    />
  );
}
