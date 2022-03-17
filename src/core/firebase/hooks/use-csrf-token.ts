import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { setCookie } from 'nookies';

const CSRF_TOKEN_NAME = 'csrfToken';
const CSRF_TOKEN_SIZE = 36;

/**
 * @description Generates a unique Token and saves it as a cookie
 */
export function useCsrfToken(
  tokenName = CSRF_TOKEN_NAME,
  tokenSize = CSRF_TOKEN_SIZE
) {
  return useCallback(() => {
    const csrfToken = nanoid(tokenSize);

    setCookie(undefined, tokenName, csrfToken, { path: '/' });

    return csrfToken;
  }, [tokenName, tokenSize]);
}
