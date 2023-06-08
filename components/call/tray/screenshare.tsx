import { useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';
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

  const { supportsScreenShare } = DailyIframe.supportedBrowser();

  if (!canSendScreenVideo || !supportsScreenShare) return null;

  return (
    <TrayButton
      className="hidden md:block"
      muted={isSharingScreen}
      onClick={handleScreenShare}
      text={isSharingScreen ? 'Stop' : 'Share'}
      icon={isSharingScreen ? 'screenShareOff' : 'screenShareOn'}
    />
  );
}
