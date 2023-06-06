'use client';

import { Sidebar } from '@/types/sidebar';
import { cn } from '@/lib/utils';
import { useIsOwner } from '@/hooks/useIsOwner';
import { TabsTrigger } from '@/components/ui/tabs';
import { Icon, Icons } from '@/components/icons';

interface Props {
  name: Sidebar;
  icon: keyof typeof Icons;
  text: string;
  disabled?: boolean;
  ownerOnly?: boolean;
}

export function Tab({
  name,
  icon,
  text,
  disabled = false,
  ownerOnly = true,
}: Props) {
  const isOwner = useIsOwner();

  if (ownerOnly && !isOwner) return null;

  return (
    <TabsTrigger
      value={name}
      className="data-[state=active]:text-selected"
      disabled={disabled}
    >
      <div className={cn('flex flex-col items-center gap-y-2')}>
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </TabsTrigger>
  );
}
