import React, { useCallback, useEffect, useState } from 'react';
import useResizeObserver from 'use-resize-observer';

interface Props {
  ref: React.RefObject<HTMLDivElement>;
  aspectRatio: number;
  onResize?: (size: { width: number; height: number }) => void;
}

export const useAspectRatio = ({ ref, aspectRatio, onResize }: Props) => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const calculateSize = useCallback(
    ({ width, height }) => {
      if (!width || !height) return;

      const originalRatio = width / height;
      let size;
      if (originalRatio > aspectRatio) {
        size = { width: Math.floor(height * aspectRatio), height };
      } else {
        size = { width, height: Math.floor(width / aspectRatio) };
      }
      setSize(size);
      onResize?.(size);
    },
    [aspectRatio, onResize]
  );

  useEffect(() => {
    if (!ref.current) return;

    const { width, height } = ref.current.getBoundingClientRect();
    calculateSize({ width: Math.round(width), height: Math.round(height) });
  }, [calculateSize, ref]);

  useResizeObserver({
    ref,
    onResize: useCallback(
      ({ width, height }) =>
        calculateSize({ width: Math.round(width), height: Math.round(height) }),
      [calculateSize]
    ),
  });

  return size;
};
