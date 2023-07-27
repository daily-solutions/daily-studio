import React, { useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  const { outputElementRef, width, height } = useVCS({
    viewportRef: divRef,
    aspectRatio: isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO,
  });

  return (
    <div
      ref={divRef}
      className={cn(
        'flex w-full flex-1 items-center justify-center bg-muted',
        `h-[calc(100%-${isOwner ? '24rem' : '14rem'})]`
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
