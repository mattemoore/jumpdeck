/**
 * @name isBrowser
 * @description Check if the code is running in the browser. Useful to avoid
 * SSR errors.
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}
