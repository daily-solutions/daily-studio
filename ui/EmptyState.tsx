import React from 'react';
import { Icon, Icons } from '@/ui/Icons';

import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon: keyof typeof Icons;
}

export function EmptyState({
  title,
  description = '',
  icon,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
      {...rest}
    >
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-md bg-muted p-8">
        <div className="w-30 h-30 rounded-full bg-background p-4">
          <Icon icon={icon} className="h-5 w-5" />
        </div>
        <h3 className="text-sm">{title}</h3>
        {description && <p className="text-xs">{description}</p>}
      </div>
    </div>
  );
}
