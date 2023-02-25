import { useApiRequest } from '~/core/hooks/use-api';
import useSWRMutation from 'swr/mutation';

interface Body {
  idToken: string;
}

/**
 * @name useCreateSession
 * @description A hook to create a Firebase session cookie. This needs to be
 * called to make authentication work with SSR when the user signs in using
 * the client SDK.
 */
export function useCreateSession() {
  const endpoint = '/api/session/sign-in';
  const fetcher = useApiRequest<void, Body>();

  return useSWRMutation(endpoint, (path, { arg }: { arg: Body }) => {
    return fetcher({
      path,
      body: arg,
    });
  });
}
