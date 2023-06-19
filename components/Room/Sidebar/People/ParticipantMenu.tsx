import React, { useCallback } from 'react';
import { Button, ButtonProps } from '@/ui/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';

import { useRMP } from '@/hooks/useRMP';
import { useStage } from '@/hooks/useStage';

interface Props {
  sessionId: string;
  variant?: ButtonProps['variant'];
}

const IS_OFF = ['off', 'blocked'];

export function ParticipantMenu({ sessionId, variant = 'ghost' }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const isLocalOwner = useParticipantProperty(localSessionId, 'owner');
  const [
    isOwner,
    isLocal,
    userData,
    hasPresence,
    participantType,
    video,
    audio,
  ] = useParticipantProperty(sessionId, [
    'owner',
    'local',
    'userData',
    'permissions.hasPresence',
    'participantType',
    'tracks.video.state',
    'tracks.audio.state',
  ]);

  const { canSendAudio, canSendVideo, canSendScreenVideo } =
    usePermissions(sessionId);

  const { remove, setStageVisibility } = useStage();

  const handlePermissionChange = useCallback(
    (type: 'audio' | 'video' | 'screen', checked: boolean) => {
      if (!daily) return;

      const permissions = new Set<
        'audio' | 'video' | 'screenAudio' | 'screenVideo'
      >();

      if (canSendAudio) permissions.add('audio');
      if (canSendVideo) permissions.add('video');
      if (canSendScreenVideo) {
        permissions.add('screenAudio');
        permissions.add('screenVideo');
      }

      switch (type) {
        case 'audio':
          if (checked) permissions.add('audio');
          else permissions.delete('audio');
          break;
        case 'video':
          if (checked) permissions.add('video');
          else permissions.delete('video');
          break;
        case 'screen':
          if (checked) {
            permissions.add('screenAudio');
            permissions.add('screenVideo');
          } else {
            permissions.delete('screenAudio');
            permissions.delete('screenVideo');
          }
          break;
      }

      daily.updateParticipant(sessionId, {
        updatePermissions: {
          hasPresence: true,
          canSend: permissions,
        },
      });
    },
    [canSendAudio, canSendScreenVideo, canSendVideo, daily, sessionId]
  );

  const handleRemoveFromStage = useCallback(
    () => remove(sessionId),
    [remove, sessionId]
  );

  const { isPlaying, updateRemoteMediaPlayer, stopRemoteMediaPlayer } =
    useRMP();

  const handlePlayPause = useCallback(async () => {
    if (isPlaying) await updateRemoteMediaPlayer({ state: 'pause' });
    else await updateRemoteMediaPlayer({ state: 'play' });
  }, [isPlaying, updateRemoteMediaPlayer]);

  const handleTurnOff = useCallback(
    (device: 'audio' | 'video' = 'video') => {
      if (!daily) return;

      daily.updateParticipant(
        sessionId,
        device === 'audio' ? { setAudio: false } : { setVideo: false }
      );
    },
    [daily, sessionId]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="auto" variant={variant}>
          <Icons.ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {participantType === 'remote-media-player' ? (
          <>
            <DropdownMenuItem onClick={handlePlayPause}>
              {isPlaying ? (
                <Icons.pause className="mr-2 h-4 w-4" />
              ) : (
                <Icons.play className="mr-2 h-4 w-4" />
              )}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={stopRemoteMediaPlayer}
            >
              <Icons.stop className="mr-2 h-4 w-4" />
              <span>Stop media player</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              disabled={
                !(userData?.['acceptedToJoin'] || userData?.['onStage'])
              }
              checked={hasPresence && userData?.['onStage']}
              onCheckedChange={() =>
                setStageVisibility(sessionId, !userData?.['onStage'])
              }
            >
              Visible on stream
            </DropdownMenuCheckboxItem>
            {isLocalOwner && !isLocal && (
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
            )}
            {isLocalOwner && !isOwner && !isLocal && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Permissions</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={canSendAudio}
                  onCheckedChange={(c) => handlePermissionChange('audio', c)}
                >
                  Audio
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={canSendVideo}
                  onCheckedChange={(c) => handlePermissionChange('video', c)}
                >
                  Video
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={canSendScreenVideo}
                  onCheckedChange={(c) => handlePermissionChange('screen', c)}
                >
                  ScreenShare
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleRemoveFromStage}
                >
                  <Icons.userMinus className="mr-2 h-4 w-4" />
                  <span>Remove from stage</span>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
