// /app/admin/quote/hooks/useDebounce.js

import { useRef, useCallback } from 'react';

/**
 * Custom hook to debounce a function.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedFunction = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup timeout on unmount
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  debouncedFunction.cancel = cancel;

  return debouncedFunction;
};

export default useDebounce;
