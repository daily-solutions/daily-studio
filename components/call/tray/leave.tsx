import { useDaily } from '@daily-co/daily-react';

import { TrayButton } from '@/components/ui/trayButton';

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
