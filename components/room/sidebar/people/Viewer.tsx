import React, { useCallback } from 'react';

import { useStage } from '@/hooks/useStage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';

export function Viewer({
  sessionId,
  userName,
}: {
  sessionId: string;
  userName: string;
}) {
  const { inviteToStage } = useStage();

  const handleInviteToStage = useCallback(
    () => inviteToStage(sessionId),
    [inviteToStage, sessionId]
  );

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={sessionId}>{userName || 'Guest'}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="auto" variant="ghost">
            <Icons.ellipsis className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleInviteToStage}>
            <Icons.userPlus className="mr-2 h-4 w-4" />
            <span>Invite to stage</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
