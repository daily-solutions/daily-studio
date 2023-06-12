'use client';

import { TabsTrigger } from '@/ui/Tabs';

import { Sidebar } from '@/types/sidebar';
import { cn } from '@/lib/utils';
import { useIsOwner } from '@/hooks/useIsOwner';
import { Icon, Icons } from '@/components/Icons';

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
