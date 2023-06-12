import { TrayButton } from '@/ui/TrayButton';
import { useDaily } from '@daily-co/daily-react';

export function Leave() {
  const daily = useDaily();

  return (
    <TrayButton
      muted
      onClick={() => daily?.leave()}
      text="Leave"
      icon="leave"
    />
  );
}
