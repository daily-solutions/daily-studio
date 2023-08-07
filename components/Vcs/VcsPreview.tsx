import React, { useEffect, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { usePermissions } from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const { hasPresence } = usePermissions();
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  const { outputElementRef, vcsCompRef, width, height } = useVCS({
    viewportRef: divRef,
    aspectRatio: isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO,
  });

  useEffect(() => {
    const vcsComp = vcsCompRef.current;
    return () => vcsComp?.stop();
  }, [vcsCompRef]);

  return (
    <div
      ref={divRef}
      className={cn(
        'flex w-full items-center justify-center bg-muted',
        isOwner
          ? 'h-[calc(100dvh-24rem)]'
          : hasPresence
          ? 'h-[calc(100dvh-19rem)]'
          : 'h-[calc(100dvh-9rem)]',
      )}
    >
      <div
        className="bg-black"
        ref={outputElementRef}
        style={{ width, height }}
      />
    </div>
  );
}
