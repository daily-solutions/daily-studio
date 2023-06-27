import React from 'react';
import { useMobileSidebar } from '@/states/mobileSidebarState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';

export default function Menu() {
  const [, setShow] = useMobileSidebar();

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
