import { useCallback, useEffect, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/Tooltip';
import { TrayButton } from '@/ui/TrayButton';
import {
  useDaily,
  useDevices,
  useLocalSessionId,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';
import { tinykeys } from 'tinykeys';

import { isTrackOff } from '@/lib/isTrackOff';

export function Video() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const videoState = useParticipantProperty(localSessionId, 'tracks.video');
  const { canSendVideo } = usePermissions();
  const { camState, hasCamError } = useDevices();

  const muted = useMemo(
    () => isTrackOff(videoState) || hasCamError,
    [videoState, hasCamError],
  );

  const disabled = useMemo(
    () => hasCamError || camState !== 'granted',
    [camState, hasCamError],
  );

  const toggleCamera = useCallback(() => {
    if (!daily || !canSendVideo) return;

    daily.setLocalVideo(muted);
  }, [canSendVideo, daily, muted]);

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TrayButton
            muted={muted}
            onClick={toggleCamera}
            text={muted ? 'Turn on' : 'Turn off'}
            icon={muted ? 'videoOff' : 'videoOn'}
            disabled={disabled}
          />
        </TooltipTrigger>
        <TooltipContent>CMD + E</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
