import { createContext } from 'react';
import { UserSession } from '~/core/session/types/user-session';

export const UserSessionContext = createContext<{
  userSession: Maybe<UserSession>;
  setUserSession: (user: Maybe<UserSession>) => void;
}>({
  userSession: undefined,
  setUserSession: (_) => _,
});
