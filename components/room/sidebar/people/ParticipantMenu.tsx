import React, { useCallback } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { useRemotePermissions } from '@/hooks/useRemotePermissions';
import { useStage } from '@/hooks/useStage';
import { useSyncParticipants } from '@/hooks/useSyncParams';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';

interface Props {
  sessionId: string;
  variant?: ButtonProps['variant'];
}

export function ParticipantMenu({ sessionId, variant = 'ghost' }: Props) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const isLocalOwner = useParticipantProperty(localSessionId, 'owner');
  const [isOwner, isLocal] = useParticipantProperty(sessionId, [
    'owner',
    'local',
  ]);
  const [paxState, setPaxState] = useParticipantsState();

  const { updateParticipants } = useSyncParticipants();

  const { canSendAudio, canSendVideo, canSendScreenVideo } =
    useRemotePermissions(sessionId);

  const { removeFromStage } = useStage();

  const onCheckedChange = useCallback(
    (checked: boolean) => {
      setPaxState((p) => {
        const paxState = {
          showAllParticipants: false,
          participantIds: checked
            ? [...p.participantIds, sessionId]
            : [...p.participantIds].filter((id) => id !== sessionId),
        };
        updateParticipants(paxState);
        return paxState;
      });
    },
    [sessionId, setPaxState, updateParticipants]
  );

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
    () => removeFromStage(sessionId),
    [removeFromStage, sessionId]
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
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          disabled={paxState.showAllParticipants}
          checked={
            paxState.showAllParticipants ||
            paxState.participantIds.includes(sessionId)
          }
          onCheckedChange={onCheckedChange}
        >
          Visible on stream
        </DropdownMenuCheckboxItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
