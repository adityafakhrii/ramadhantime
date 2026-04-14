import { useState, useCallback } from 'react';

const STORAGE_KEY = 'akyash-ramadhan-mode';

export function useRamadhanMode() {
  const [isRamadhan, setIsRamadhan] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const toggleRamadhan = useCallback((val?: boolean) => {
    setIsRamadhan(prev => {
      const next = val !== undefined ? val : !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { isRamadhan, toggleRamadhan };
}
