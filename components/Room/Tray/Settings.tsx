import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { TrayButton } from '@/ui/TrayButton';

import { Devices } from '@/components/Room/Devices';

export function Settings() {
  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <TrayButton text="Settings" icon="settings" />
      </PopoverTrigger>
      <PopoverContent side="top" className="min-w-max">
        <Devices />
      </PopoverContent>
    </Popover>
  );
}
