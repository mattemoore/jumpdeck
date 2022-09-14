import { useCallback } from 'react';

/**
 * @description Retrieves the current CSRF token in the page
 */
export function useGetCsrfToken() {
  return useCallback(() => {
    const element = document.querySelector('meta[name="csrf-token"]');

    return element?.getAttribute('content');
  }, []);
}
