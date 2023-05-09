import { useCallback } from 'react';
import { useScreenShare } from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

export function Screenshare() {
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const handleScreenShare = useCallback(
    () => (isSharingScreen ? stopScreenShare() : startScreenShare()),
    [isSharingScreen, startScreenShare, stopScreenShare]
  );

  return (
    <TrayButton
      muted={isSharingScreen}
      onClick={handleScreenShare}
      text={isSharingScreen ? 'Stop' : 'Share'}
      icon={isSharingScreen ? 'screenShareOff' : 'screenShareOn'}
    />
  );
}
