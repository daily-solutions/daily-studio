import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (event) => setMatches(event.matches);
    handleChange(mediaQuery);

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return matches;
};
