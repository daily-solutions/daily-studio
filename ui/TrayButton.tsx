import React from 'react';
import { Button } from '@/ui/Button';

import { cn } from '@/lib/utils';
import { Icon, Icons } from '@/components/Icons';

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  text: string;
  icon: keyof typeof Icons;
  onClick?: () => void;
  muted?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export function TrayButton({
  text,
  icon,
  onClick,
  muted,
  selected,
  disabled = false,
  className,
}: Props) {
  const textColor = muted
    ? 'text-destructive'
    : selected
    ? 'text-selected'
    : 'text-inherit';

  return (
    <Button
      variant="ghost"
      size="trayButton"
      onClick={onClick}
      className={cn(textColor, className)}
      disabled={disabled}
    >
      <div className="flex flex-col items-center justify-center gap-y-1">
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </Button>
  );
}
