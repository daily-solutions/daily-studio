'use client';

import { Sidebar, useSidebar } from '@/states/sidebar';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon, Icons } from '@/components/icons';

interface Props {
  name: Sidebar;
  icon: keyof typeof Icons;
  text: string;
}

export function CategoryTab({ name, icon, text }: Props) {
  const [sidebar, setSidebar] = useSidebar();

  return (
    <Button variant="none" size="auto" onClick={() => setSidebar(name)}>
      <div
        className={cn(
          'flex flex-col items-center gap-y-2',
          sidebar === name && 'text-primary'
        )}
      >
        <Icon icon={icon} className="h-6 w-6" />
        <p className="text-xs">{text}</p>
      </div>
    </Button>
  );
}
