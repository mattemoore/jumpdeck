import { useCallback } from 'react';

import { useAuth } from 'reactfire';
import { FirebaseError } from 'firebase/app';
import type { UserCredential } from 'firebase/auth';

import { useRequestState } from '../../hooks/use-request-state';

export function useSignUpWithEmailAndPassword() {
  const auth = useAuth();

  const { state, setLoading, setData, setError } = useRequestState<
    UserCredential,
    FirebaseError
  >();

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);

      try {
        const { createUserWithEmailAndPassword } = await import(
          'firebase/auth'
        );

        const credential = await createUserWithEmailAndPassword(
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

  return [signUp, state] as [typeof signUp, typeof state];
}
