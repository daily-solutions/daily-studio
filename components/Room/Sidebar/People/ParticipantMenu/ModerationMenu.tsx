import React, { useCallback } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';
import { DailyParticipantUpdateOptions } from '@daily-co/daily-js';
import { useDaily, useParticipantProperty } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

const IS_OFF = ['off', 'blocked'];

export function ModerationMenu({ sessionId }: { sessionId: string }) {
  const daily = useDaily();
  const isOwner = useIsOwner();

  const [video, audio, screenVideo, isLocal] = useParticipantProperty(
    sessionId,
    [
      'tracks.video.state',
      'tracks.audio.state',
      'tracks.screenVideo.state',
      'local',
    ],
  );

  const handleTurnOff = useCallback(
    (device: 'audio' | 'video' | 'screen' = 'video') => {
      if (!daily) return;

      if (isLocal && device === 'screen') {
        // as we can't turn off screen share of local participant
        // from updateParticipant, we need to use stopScreenShare
        daily.stopScreenShare();
        return;
      }

      const updates: DailyParticipantUpdateOptions =
        device === 'audio'
          ? { setAudio: false }
          : device === 'screen'
          ? { setScreenShare: false }
          : { setVideo: false };
      daily.updateParticipant(sessionId, updates);
    },
    [daily, isLocal, sessionId],
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
      <DropdownMenuItem
        disabled={IS_OFF.includes(screenVideo)}
        onClick={() => handleTurnOff('screen')}
      >
        <Icons.screenShareOff className="mr-2 h-4 w-4" />
        <span>Stop screenshare</span>
      </DropdownMenuItem>
    </>
  );
}
