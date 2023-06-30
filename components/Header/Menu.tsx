import React from 'react';
import { useMobileSidebar } from '@/states/mobileSidebarState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';

import { useIsMobile } from '@/hooks/useIsMobile';

export default function Menu() {
  const isMobile = useIsMobile();
  const [, setShow] = useMobileSidebar();

  if (!isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 px-0"
      onClick={() => setShow((show) => !show)}
    >
      <Icons.menu />
    </Button>
  );
}
