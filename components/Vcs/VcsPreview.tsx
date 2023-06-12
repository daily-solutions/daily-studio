import React, { useRef } from 'react';
import { AspectRatio } from '@/ui/AspectRatio';

import { useAspectRatio } from '@/hooks/useAspectRatio';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const divRef = useRef<HTMLDivElement>(null);

  const size = useAspectRatio({
    ref: divRef,
    aspectRatio: 16 / 9,
  });

  const { outputElementRef } = useVCS({
    viewport: size,
  });

  return (
    <div
      ref={divRef}
      className="flex h-full w-full flex-1 items-center justify-center bg-muted"
    >
      <div style={{ ...size }}>
        <AspectRatio className="bg-black" ratio={16 / 9}>
          <div
            className="h-full w-full overflow-hidden"
            ref={outputElementRef}
          />
        </AspectRatio>
      </div>
    </div>
  );
}
