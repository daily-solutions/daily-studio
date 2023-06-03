import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useResizeObserver from 'use-resize-observer';

import { useVCSCompositionWrapper } from '@/hooks/useVCSCompositionWrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function VcsPreview() {
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!divRef.current) return;

    const { width, height } = divRef.current.getBoundingClientRect();
    setSize({ width: Math.round(width), height: Math.round(height) });
  }, []);

  const { previewWidth, previewHeight } = useMemo(() => {
    const { width, height } = size;
    if (!width || !height) return { previewWidth: 0, previewHeight: 0 };

    const targetRatio = 16 / 9;
    const originalRatio = width / height;

    if (originalRatio > targetRatio) {
      return {
        previewWidth: Math.floor(height * targetRatio),
        previewHeight: height,
      };
    } else {
      return {
        previewWidth: width,
        previewHeight: Math.floor(width / targetRatio),
      };
    }
  }, [size]);

  const { outputElementRef, vcsCompRef } = useVCSCompositionWrapper({
    viewport: {
      width: previewWidth,
      height: previewHeight,
    },
  });

  useResizeObserver({
    ref: divRef,
    onResize: useCallback(
      ({ width, height }) => {
        setSize({ width: Math.round(width), height: Math.round(height) });
        vcsCompRef.current?.rootDisplaySizeChanged();
      },
      [vcsCompRef]
    ),
  });

  return (
    <div
      ref={divRef}
      className="flex h-full w-full flex-1 items-center justify-center"
    >
      <div style={{ width: previewWidth, height: previewHeight }}>
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
