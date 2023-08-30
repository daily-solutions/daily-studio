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
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useRMP } from '@/hooks/useRMP';
import { useStage } from '@/hooks/useStage';
import { useUserData } from '@/hooks/useUserData';

interface Props {
  sessionId: string;
  variant?: ButtonProps['variant'];
}

const IS_OFF = ['off', 'blocked'];

function PermissionsMenu({ sessionId }: { sessionId: string }) {
  const daily = useDaily();
  const { canSendAudio, canSendVideo, canSendScreenVideo } =
    usePermissions(sessionId);

  const [isOwner, isLocal] = useParticipantProperty(sessionId, [
    'owner',
    'local',
  ]);
  const isLocalOwner = useIsOwner();

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
    [canSendAudio, canSendScreenVideo, canSendVideo, daily, sessionId],
  );

  const { remove } = useStage();

  const handleRemoveFromStage = useCallback(
    () => remove(sessionId),
    [remove, sessionId],
  );

  if (isOwner || isLocal || !isLocalOwner) return null;

  return (
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
  );
}

function ModerationMenu({ sessionId }: { sessionId: string }) {
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

function RemoteMediaPlayerMenu() {
  const { isPlaying, updateRemoteMediaPlayer, stopRemoteMediaPlayer } =
    useRMP();

  const handlePlayPause = useCallback(
    async () =>
      await updateRemoteMediaPlayer({ state: isPlaying ? 'pause' : 'play' }),
    [isPlaying, updateRemoteMediaPlayer],
  );

  return (
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
  );
}

function StageVisibilityMenu({ sessionId }: { sessionId: string }) {
  const { hasPresence } = usePermissions(sessionId);
  const userData = useUserData(sessionId);

  const { setStageVisibility } = useStage();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        disabled={!(userData?.['acceptedToJoin'] || userData?.['onStage'])}
        checked={hasPresence && userData?.['onStage']}
        onCheckedChange={() =>
          setStageVisibility(sessionId, !userData?.['onStage'])
        }
      >
        Visible on stream
      </DropdownMenuCheckboxItem>
    </>
  );
}

export function ParticipantMenu({ sessionId, variant = 'ghost' }: Props) {
  const participantType = useParticipantProperty(sessionId, 'participantType');

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
          <RemoteMediaPlayerMenu />
        ) : (
          <>
            <StageVisibilityMenu sessionId={sessionId} />
            <ModerationMenu sessionId={sessionId} />
            <PermissionsMenu sessionId={sessionId} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
