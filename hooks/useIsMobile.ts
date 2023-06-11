import { useCallback, useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [width, setWidth] = useState(0);

  const handleWindowResize = useCallback(() => setWidth(window.innerWidth), []);

  useEffect(() => {
    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);

  return width < 768;
};
