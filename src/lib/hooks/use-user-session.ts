import { useContext } from 'react';
import { UserSessionContext } from '~/lib/contexts/session';

export function useUserSession() {
  const { userSession } = useContext(UserSessionContext);

  return userSession;
}
