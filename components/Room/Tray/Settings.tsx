import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';

import { Devices } from '@/components/Room/Devices';

export function Settings() {
  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="settings" className="h-6 w-6" />
            <p className="text-xs">Settings</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="min-w-max">
        <Devices />
      </PopoverContent>
    </Popover>
  );
}
