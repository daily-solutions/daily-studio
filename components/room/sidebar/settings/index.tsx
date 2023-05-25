import { QualityToggle } from '@/components/room/sidebar/settings/QualityToggle';
import { ThemeToggle } from '@/components/room/sidebar/settings/ThemeToggle';

export function Settings() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <ThemeToggle />
        <QualityToggle />
      </div>
    </div>
  );
}
