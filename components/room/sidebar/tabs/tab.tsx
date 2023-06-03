'use client';

import { Sidebar, useSidebar } from '@/states/sidebar';

import { cn } from '@/lib/utils';
import { useIsOwner } from '@/hooks/useIsOwner';
import { Button } from '@/components/ui/button';
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
  const [sidebar, setSidebar] = useSidebar();

  if (ownerOnly && !isOwner) return null;

  return (
    <Button
      variant="none"
      size="auto"
      disabled={disabled}
      onClick={() => setSidebar(name)}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-y-2',
          sidebar === name && 'text-selected'
        )}
      >
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </Button>
  );
}
