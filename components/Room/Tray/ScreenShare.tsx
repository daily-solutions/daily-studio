import { useCallback } from 'react';
import { config } from '@/config';
import { TrayButton } from '@/ui/TrayButton';
import DailyIframe from '@daily-co/daily-js';
import { usePermissions, useScreenShare } from '@daily-co/daily-react';

export function Screenshare() {
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();

  const { canSendScreenVideo } = usePermissions();

  const handleScreenShare = useCallback(
    () => (isSharingScreen ? stopScreenShare() : startScreenShare()),
    [isSharingScreen, startScreenShare, stopScreenShare],
  );

  const { supportsScreenShare } = DailyIframe.supportedBrowser();

  if (
    !canSendScreenVideo ||
    !supportsScreenShare ||
    !config?.options?.enable_screenshare
  )
    return null;

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
