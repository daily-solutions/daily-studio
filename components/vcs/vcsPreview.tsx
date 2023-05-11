import React from 'react';

import { useVCSCompositionWrapper } from '@/hooks/useVCSCompositionWrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function VcsPreview() {
  const { outputElementRef } = useVCSCompositionWrapper();

  return (
    <div className="flex h-[calc(100%-4rem)] w-full flex-1 items-center justify-center bg-muted p-6">
      <AspectRatio
        id="vcs-viewport"
        className="h-full w-full bg-black"
        ratio={16 / 9}
      >
        <div className="h-full w-full overflow-hidden" ref={outputElementRef} />
      </AspectRatio>
    </div>
  );
}
