import { useContext } from 'react';
import { UserSessionContext } from '~/core/session/contexts/user-session';

export function useUserSession() {
  const { userSession } = useContext(UserSessionContext);

  return userSession;
}
