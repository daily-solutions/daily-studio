import { useCallback, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/Tooltip';
import { TrayButton } from '@/ui/TrayButton';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';
import { tinykeys } from 'tinykeys';

interface Props {
  disabled?: boolean;
}

export function Audio({ disabled = false }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const audio = useParticipantProperty(localSessionId, 'audio');

  const { canSendAudio } = usePermissions();

  const toggleMic = useCallback(() => {
    if (!daily || !canSendAudio) return;

    daily.setLocalAudio(!audio);
  }, [audio, canSendAudio, daily]);

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
            muted={!audio}
            onClick={() => daily?.setLocalAudio(!audio)}
            text={audio ? 'Mute' : 'Unmute'}
            icon={audio ? 'micOn' : 'micOff'}
            disabled={disabled}
          />
        </TooltipTrigger>
        <TooltipContent>CMD + D</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
