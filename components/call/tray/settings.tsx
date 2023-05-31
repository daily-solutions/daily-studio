import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icon } from '@/components/icons';

import { Devices } from '../devices';

export function Settings() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="settings" className="h-6 w-6" />
            <p className="text-xs">Settings</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-100">
        <Devices />
      </PopoverContent>
    </Popover>
  );
}
