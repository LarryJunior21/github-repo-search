import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = (...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => callback(...args), delay);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return debounced;
}
