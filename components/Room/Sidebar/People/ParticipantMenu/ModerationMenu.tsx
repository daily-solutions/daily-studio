import React, { useCallback } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';
import { useDaily, useParticipantProperty } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

const IS_OFF = ['off', 'blocked'];

export function ModerationMenu({ sessionId }: { sessionId: string }) {
  const daily = useDaily();
  const isOwner = useIsOwner();

  const [video, audio] = useParticipantProperty(sessionId, [
    'tracks.video.state',
    'tracks.audio.state',
  ]);

  const handleTurnOff = useCallback(
    (device: 'audio' | 'video' = 'video') => {
      if (!daily) return;

      const updates =
        device === 'audio' ? { setAudio: false } : { setVideo: false };
      daily.updateParticipant(sessionId, updates);
    },
    [daily, sessionId],
  );

  if (!isOwner) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Moderation</DropdownMenuLabel>
      <DropdownMenuItem
        disabled={IS_OFF.includes(video)}
        onClick={() => handleTurnOff('video')}
      >
        <Icons.videoOff className="mr-2 h-4 w-4" />
        <span>Turn off camera</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={IS_OFF.includes(audio)}
        onClick={() => handleTurnOff('audio')}
      >
        <Icons.micOff className="mr-2 h-4 w-4" />
        <span>Mute microphone</span>
      </DropdownMenuItem>
    </>
  );
}
