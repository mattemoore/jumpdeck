import { useCallback } from 'react';
import { useAuth } from 'reactfire';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

import { useRequestState } from '../../hooks/use-request-state';

export function useSignInWithEmailAndPassword() {
  const auth = useAuth();

  const { state, setLoading, setData, setError } = useRequestState<
    UserCredential,
    FirebaseError
  >();

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);

      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setData(credential);

        return credential;
      } catch (error) {
        setError(error as FirebaseError);
      }
    },
    [auth, setData, setError, setLoading]
  );

  return [signIn, state] as [typeof signIn, typeof state];
}
