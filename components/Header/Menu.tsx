import React from 'react';
import { useMobileSidebar } from '@/states/mobileSidebarState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';
import { useMeetingState } from '@daily-co/daily-react';

import { useIsMobile } from '@/hooks/useIsMobile';

export function Menu() {
  const isMobile = useIsMobile();
  const meetingState = useMeetingState();
  const [, setShow] = useMobileSidebar();

  if (!isMobile || meetingState !== 'joined-meeting') return null;

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
