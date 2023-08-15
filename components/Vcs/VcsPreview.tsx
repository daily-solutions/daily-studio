import React, { useEffect, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
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
      className="flex h-full w-full flex-1 items-center justify-center overflow-hidden bg-muted"
    >
      <div
        className="bg-black"
        ref={outputElementRef}
        style={{ width, height }}
      />
    </div>
  );
}
