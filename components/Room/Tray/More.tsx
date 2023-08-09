import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu';
import { TrayButton } from '@/ui/TrayButton';

import { Record } from '@/components/Room/Tray/Record';
import { Stream } from '@/components/Room/Tray/Stream';

export function More() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block md:hidden" asChild>
        <TrayButton text="More" icon="ellipsis" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Record mobileUi />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Stream mobileUi />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
