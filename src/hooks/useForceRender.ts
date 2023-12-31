import { useState, useCallback } from 'react';

export function useForceRender() {
  const [, setTick] = useState(0);
  return useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
}
