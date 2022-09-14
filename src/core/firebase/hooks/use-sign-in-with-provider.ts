import { useCallback } from 'react';

import { useAuth } from 'reactfire';
import { FirebaseError } from 'firebase/app';

import {
  AuthProvider,
  signInWithPopup,
  browserPopupRedirectResolver,
  UserCredential,
  Auth,
  reauthenticateWithPopup,
} from 'firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';

export function useSignInWithProvider() {
  const auth = useAuth();

  const { state, setLoading, setData, setError } = useRequestState<
    UserCredential,
    FirebaseError
  >();

  const signInWithProvider = useCallback(
    async (provider: AuthProvider) => {
      setLoading(true);

      try {
        const credential = await getCredential(auth, provider);

        setData(credential);

        return credential;
      } catch (error) {
        setError(error as FirebaseError);

        return Promise.reject(error);
      }
    },
    [auth, setData, setError, setLoading]
  );

  return [signInWithProvider, state] as [
    typeof signInWithProvider,
    typeof state
  ];
}

async function getCredential(auth: Auth, provider: AuthProvider) {
  const user = auth.currentUser;

  if (user) {
    return reauthenticateWithPopup(
      user,
      provider,
      browserPopupRedirectResolver
    );
  }

  return signInWithPopup(auth, provider, browserPopupRedirectResolver);
}
