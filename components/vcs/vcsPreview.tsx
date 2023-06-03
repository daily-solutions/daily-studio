import React from 'react';

import { cn } from '@/lib/utils';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useVCSCompositionWrapper } from '@/hooks/useVCSCompositionWrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function VcsPreview() {
  const isOwner = useIsOwner();

  const { outputElementRef } = useVCSCompositionWrapper();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div
        className={cn(
          'h-full p-4',
          isOwner ? 'w-[calc((100dvh-20rem)*(16/9))]' : 'w-full'
        )}
      >
        <AspectRatio id="vcs-viewport" className="bg-black" ratio={16 / 9}>
          <div className="overflow-hidden" ref={outputElementRef} />
        </AspectRatio>
      </div>
    </div>
  );
}
