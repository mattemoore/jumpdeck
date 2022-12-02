import { useCallback } from 'react';
import type { User } from 'firebase/auth';

import { useCreateSession } from '~/core/hooks/use-create-session';

/**
 * @name useCreateServerSideSession
 * @description A hook to create a session on the server-side to make
 * authentication work with SSR.
 */
function useCreateServerSideSession() {
  const [signIn, signInState] = useCreateSession();

  const signInCallback = useCallback(
    async (user: User, forceRefresh = true) => {
      const idToken = await user.getIdToken(forceRefresh);

      return signIn({ idToken });
    },
    [signIn]
  );

  return [signInCallback, signInState] as [
    typeof signInCallback,
    typeof signInState
  ];
}

export default useCreateServerSideSession;
