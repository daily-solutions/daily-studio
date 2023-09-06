import React, { useCallback } from 'react';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';
import {
  useDaily,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useStage } from '@/hooks/useStage';

export function PermissionsMenu({ sessionId }: { sessionId: string }) {
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
