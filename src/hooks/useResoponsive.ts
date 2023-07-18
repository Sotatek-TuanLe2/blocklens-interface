import { useEffect, useState } from 'react';

const sizeOption = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1024,
};

export const useResoponsive = (size: 'sm' | 'md' | 'lg' | 'xl' = 'lg') => {
  const dimensionMobile = sizeOption[size];
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= dimensionMobile,
  );

  const handleResize = () => {
    setIsMobile(window.innerWidth <= dimensionMobile);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile };
};
