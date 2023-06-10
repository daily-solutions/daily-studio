import { useCallback, useEffect } from 'react';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';
import { tinykeys } from 'tinykeys';

import { TrayButton } from '@/components/ui/trayButton';

interface Props {
  disabled?: boolean;
}

export function Video({ disabled = false }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const video = useParticipantProperty(localSessionId, 'video');

  const { canSendVideo } = usePermissions();

  const toggleCamera = useCallback(() => {
    if (!daily || !canSendVideo) return;

    daily.setLocalVideo(!video);
  }, [canSendVideo, daily, video]);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyE': (ev) => {
        ev.preventDefault();
        toggleCamera();
      },
    });
    return () => {
      unsubscribe();
    };
  }, [toggleCamera]);

  if (!canSendVideo) return null;

  return (
    <TrayButton
      muted={!video}
      onClick={toggleCamera}
      text={video ? 'Turn off' : 'Turn on'}
      icon={video ? 'videoOn' : 'videoOff'}
      disabled={disabled}
    />
  );
}
