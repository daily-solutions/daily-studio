'use client';

import { Icon, Icons } from '@/ui/Icons';
import { TabsTrigger } from '@/ui/Tabs';

import { Sidebar } from '@/types/sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';

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
  const isMobile = useIsMobile();

  if (ownerOnly && !isOwner) return null;

  return (
    <TabsTrigger
      value={name}
      className="data-[state=active]:text-primary data-[state=active]:shadow-none"
      disabled={disabled}
    >
      {isMobile ? (
        <p className="text-sm">{text}</p>
      ) : (
        <div className={cn('flex flex-col items-center gap-y-2')}>
          <Icon icon={icon} className="h-6 w-6" />
          <p className="text-xs">{text}</p>
        </div>
      )}
    </TabsTrigger>
  );
}
