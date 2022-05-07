import React, { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useWindowSizeFromVW = (width: string) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    if (!width) return;

    const handleOnResize = () => {
      const w = Number(width.slice(0, -2));
      setResult((document.documentElement.clientWidth * w) / 100);
    };
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => window.removeEventListener('resize', handleOnResize);
  }, [width]);

  return result;
};
