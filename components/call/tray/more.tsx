import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Record } from '@/components/call/tray/record';
import { Stream } from '@/components/call/tray/stream';
import { Icon } from '@/components/icons';

export function More() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block md:hidden" asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="ellipsis" className="h-6 w-6" />
            <p className="text-xs">More</p>
          </div>
        </Button>
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
