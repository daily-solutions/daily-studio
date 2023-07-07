import React, { useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { AspectRatio } from '@/ui/AspectRatio';

import { useAspectRatio } from '@/hooks/useAspectRatio';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  const size = useAspectRatio({
    ref: divRef,
    aspectRatio: isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO,
  });

  const { outputElementRef } = useVCS({ viewport: size });

  return (
    <div
      ref={divRef}
      className="flex h-full w-full flex-1 items-center justify-center bg-muted"
    >
      <div style={{ ...size }}>
        <AspectRatio
          className="bg-black"
          ratio={isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO}
        >
          <div
            className="h-full w-full overflow-hidden"
            ref={outputElementRef}
          />
        </AspectRatio>
      </div>
    </div>
  );
}
