import React from 'react';
import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { cn } from '@/lib/utils';
import { useVCSCompositionWrapper } from '@/hooks/useVCSCompositionWrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function VcsPreview() {
  const localSessionId = useLocalSessionId();
  const isOwner = useParticipantProperty(localSessionId, 'owner');

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
