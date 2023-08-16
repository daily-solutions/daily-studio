import React, { useEffect, useMemo, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  DESKTOP_PORTRAIT_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { useParams } from '@/states/params';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);
  const [params] = useParams();

  const aspectRatio = useMemo(() => {
    if (isMobile) return MOBILE_ASPECT_RATIO;
    else if (params?.['custom.viewport'] === 'portrait')
      return DESKTOP_PORTRAIT_ASPECT_RATIO;
    else return DESKTOP_ASPECT_RATIO;
  }, [isMobile, params]);

  const { outputElementRef, vcsCompRef, width, height } = useVCS({
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
