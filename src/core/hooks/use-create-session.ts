import { useApiRequest } from '~/core/hooks/use-api';

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
  return useApiRequest<void, Body>('/api/session/sign-in');
}
