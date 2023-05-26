import { useCallback } from 'react';
import { usePermissions, useScreenShare } from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

export function Screenshare() {
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const { canSendScreenVideo } = usePermissions();

  const handleScreenShare = useCallback(
    () => (isSharingScreen ? stopScreenShare() : startScreenShare()),
    [isSharingScreen, startScreenShare, stopScreenShare]
  );

  if (!canSendScreenVideo) return null;

  return (
    <TrayButton
      muted={isSharingScreen}
      onClick={handleScreenShare}
      text={isSharingScreen ? 'Stop' : 'Share'}
      icon={isSharingScreen ? 'screenShareOff' : 'screenShareOn'}
    />
  );
}
