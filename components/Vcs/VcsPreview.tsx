import React, { useEffect, useMemo, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  DESKTOP_PORTRAIT_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { useParams } from '@/states/params';

import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const divRef = useRef<HTMLDivElement>(null);
  const [params] = useParams();

  const aspectRatio = useMemo(() => {
    if (params?.['custom.viewport'] === 'portrait')
      return DESKTOP_PORTRAIT_ASPECT_RATIO;
    else return DESKTOP_ASPECT_RATIO;
  }, [params]);

  const { vcsCompRef, vcsContainerRef } = useVCS({
    viewportRef: divRef,
    aspectRatio,
  });

  useEffect(() => {
    const vcsComp = vcsCompRef.current;
    return () => vcsComp?.stop();
  }, [vcsCompRef]);

  return (
    <div
      ref={divRef}
      className="LiveFeed relative flex h-full w-full items-center justify-center overflow-hidden bg-muted"
    >
      <div
        ref={vcsContainerRef}
        className="VCSRenderer bg-black"
        style={{ aspectRatio }}
      />
    </div>
  );
}
