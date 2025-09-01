import { useState, useEffect } from "react";

/**
 * Custom debounce hook
 * @param value - The value to debounce (string, number, etc.)
 * @param delay - Delay in ms (default: 500ms)
 * @returns debouncedValue
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
