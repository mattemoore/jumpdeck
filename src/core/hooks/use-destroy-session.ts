import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useDestroySession
 * @description A hook to destroy the current Firebase session cookie. This
 * needs to be called when the user signs out.
 */
export function useDestroySession() {
  const [request] = useApiRequest('/api/session/sign-out');

  return request;
}
