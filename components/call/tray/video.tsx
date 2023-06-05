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

export function Video({ disabled = false }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const video = useParticipantProperty(localSessionId, 'video');

  const { canSendVideo } = usePermissions();

  if (!canSendVideo) return null;

  return (
    <TrayButton
      muted={!video}
      onClick={() => daily?.setLocalVideo(!video)}
      text={video ? 'Turn off' : 'Turn on'}
      icon={video ? 'videoOn' : 'videoOff'}
      disabled={disabled}
    />
  );
}
