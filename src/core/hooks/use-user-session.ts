import { useContext } from 'react';
import { UserSessionContext } from '~/core/contexts/user-session';

/**
 * @name useUserSession
 * @description A hook to get the current user's session. Use this hook to
 * get the current user's session. This is ideal for getting the current
 * user's in both client and server-side since it's hydrated on the server,
 * with no need to wait for the client SDK to initialize.
 */
export function useUserSession() {
  const { userSession } = useContext(UserSessionContext);

  return userSession;
}
