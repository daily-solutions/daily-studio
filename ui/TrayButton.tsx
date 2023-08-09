import React, { forwardRef } from 'react';
import { Button } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icons';

import { cn } from '@/lib/utils';

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  text: string;
  icon: keyof typeof Icons;
  onClick?: () => void;
  muted?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export const TrayButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      text,
      icon,
      onClick,
      muted,
      selected,
      disabled = false,
      className,
      ...props
    }: Props,
    ref,
  ) => {
    const textColor = muted
      ? 'text-destructive'
      : selected
      ? 'text-selected'
      : 'text-inherit';

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="trayButton"
        onClick={onClick}
        className={cn(textColor, className)}
        disabled={disabled}
        {...props}
      >
        <div className="flex flex-col items-center justify-center gap-y-1">
          <Icon icon={icon} className="h-6 w-6" />
          <p className="text-xs">{text}</p>
        </div>
      </Button>
    );
  },
);

TrayButton.displayName = 'TrayButton';
