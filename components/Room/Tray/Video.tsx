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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TrayButton
            muted={!video}
            onClick={toggleCamera}
            text={video ? 'Turn off' : 'Turn on'}
            icon={video ? 'videoOn' : 'videoOff'}
            disabled={disabled}
          />
        </TooltipTrigger>
        <TooltipContent>CMD + E</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
