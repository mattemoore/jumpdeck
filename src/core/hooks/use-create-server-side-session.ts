import { useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';

import { useCreateSession } from '~/core/hooks/use-create-session';

/**
 * @name useCreateServerSideSession
 * @description A hook to create a session on the server-side to make
 * authentication work with SSR.
 */
function useCreateServerSideSession() {
  const { trigger, ...mutationState } = useCreateSession();

  const signInCallback = useCallback(
    async (user: User, forceRefresh = true) => {
      const idToken = await user.getIdToken(forceRefresh);

      return trigger({ idToken });
    },
    [trigger]
  );

  const state = useMemo(() => {
    return {
      data: mutationState.data,
      error: mutationState.error,
      loading: mutationState.isMutating,
      success: !mutationState.isMutating && mutationState.data,
    };
  }, [mutationState]);

  return [signInCallback, state] as [typeof signInCallback, typeof state];
}

export default useCreateServerSideSession;
