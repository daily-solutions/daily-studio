import { useMemo } from 'react';
import { Icon } from '@/ui/Icons';
import { useParticipantProperty } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';

interface Props {
  sessionId: string;
}

const AUDIO_OFF = ['off', 'interrupted', 'blocked'];

export function TileUserName({ sessionId }: Props) {
  const [userName, isLocal, participantType, audioState] =
    useParticipantProperty(sessionId, [
      'user_name',
      'local',
      'participantType',
      'tracks.audio.state',
    ]);

  const tileName = useMemo(
    () =>
      participantType === 'remote-media-player' ? 'RMP' : userName || 'Guest',
    [userName, participantType]
  );

  return (
    <div className="absolute bottom-2 left-2 flex items-center justify-center rounded-md bg-muted p-2">
      {participantType !== 'remote-media-player' && (
        <Icon
          icon={AUDIO_OFF.includes(audioState) ? 'micOff' : 'micOn'}
          className={cn(
            'mr-2 h-4 w-4',
            AUDIO_OFF.includes(audioState) ? 'text-destructive' : 'text-inherit'
          )}
        />
      )}
      <p className="select-none text-sm">
        {tileName} {isLocal && '(You)'}
      </p>
    </div>
  );
}
