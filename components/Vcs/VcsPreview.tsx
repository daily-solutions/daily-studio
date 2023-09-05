import React, { useMemo, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  DESKTOP_PORTRAIT_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { useParams } from '@/states/params';

import { cn } from '@/lib/utils';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const divRef = useRef<HTMLDivElement>(null);
  const [params] = useParams();

  const isPortrait = useMemo(
    () => params?.['custom.viewport'] === 'portrait',
    [params],
  );

  const aspectRatio = useMemo(() => {
    if (isPortrait) return DESKTOP_PORTRAIT_ASPECT_RATIO;
    else return DESKTOP_ASPECT_RATIO;
  }, [isPortrait]);

  const { vcsContainerRef } = useVCS({
    viewportRef: divRef,
    aspectRatio,
  });

  return (
    <div
      ref={divRef}
      className="LiveFeed relative flex h-full w-full items-center justify-center overflow-hidden bg-muted"
    >
      <div
        ref={vcsContainerRef}
        className={cn(
          'VCSRenderer bg-black',
          isPortrait ? 'portrait' : 'landscape',
        )}
        style={{ aspectRatio }}
      />
    </div>
  );
}
