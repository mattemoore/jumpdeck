import { useApiRequest } from '~/core/hooks/use-api';
import useSWRMutation from 'swr/mutation';

/**
 * @name useDestroySession
 * @description A hook to destroy the current Firebase session cookie. This
 * needs to be called when the user signs out.
 */
export function useDestroySession() {
  const endpoint = '/api/session/sign-out';
  const fetcher = useApiRequest();

  return useSWRMutation(endpoint, (path) => {
    return fetcher({
      path,
    });
  });
}
