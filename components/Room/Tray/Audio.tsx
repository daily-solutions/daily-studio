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

export function Audio() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const audioState = useParticipantProperty(localSessionId, 'tracks.audio');
  const { canSendAudio } = usePermissions();
  const { hasMicError, micState } = useDevices();

  const muted = useMemo(
    () => isTrackOff(audioState) || hasMicError,
    [audioState, hasMicError],
  );

  const disabled = useMemo(
    () => hasMicError || micState !== 'granted',
    [hasMicError, micState],
  );

  const toggleMic = useCallback(() => {
    if (!daily || !canSendAudio) return;

    daily.setLocalAudio(muted);
  }, [canSendAudio, daily, muted]);

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyD': (ev) => {
        ev.preventDefault();
        toggleMic();
      },
    });
    return () => {
      unsubscribe();
    };
  }, [toggleMic]);

  if (!canSendAudio) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TrayButton
            muted={muted}
            onClick={toggleMic}
            text={muted ? 'Unmute' : 'Mute'}
            icon={muted ? 'micOff' : 'micOn'}
            disabled={disabled}
          />
        </TooltipTrigger>
        <TooltipContent>CMD + D</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
