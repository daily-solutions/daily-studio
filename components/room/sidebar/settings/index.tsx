import { SendQuality } from '@/components/room/sidebar/settings/SendQuality';
import { ThemeToggle } from '@/components/room/sidebar/settings/ThemeToggle';

export function Settings() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <ThemeToggle />
        <SendQuality />
      </div>
    </div>
  );
}
