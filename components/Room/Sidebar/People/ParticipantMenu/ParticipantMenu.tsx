import React from 'react';
import { Button, ButtonProps } from '@/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu';
import { Icons } from '@/ui/Icons';

import { ParticipantMenuActions } from '@/components/Room/Sidebar/People/ParticipantMenu/ParticipantMenuActions';

interface Props {
  sessionId: string;
  variant?: ButtonProps['variant'];
}

export function ParticipantMenu({ sessionId, variant = 'ghost' }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="auto" variant={variant}>
          <Icons.ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <ParticipantMenuActions sessionId={sessionId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
