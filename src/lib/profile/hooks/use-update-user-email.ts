import { useCallback, useEffect } from 'react';
import { useUser } from 'reactfire';
import { FirebaseError } from 'firebase/app';

import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

type Data = {
  oldEmail: string;
  email: string;
  password: string;
};

/**
 * @name useUpdateUserEmail
 */
export function useUpdateUserEmail() {
  const { data: user } = useUser();
  const { state, setLoading, setData, setError, resetState } =
    useRequestState<void>();

  const [signIn, signInState] = useCreateSession();
  const getCsrfToken = useCsrfToken();

  useEffect(() => {
    if (signInState.success) {
      setData();
    }
  }, [signInState.success, setData]);

  const useUpdateUserEmailCallback = useCallback(
    async (data: Data) => {
      if (data && user) {
        setLoading(true);

        const emailAuthCredential = EmailAuthProvider.credential(
          data.oldEmail,
          data.password
        );

        try {
          // first, we check if the password is correct
          const credential = await reauthenticateWithCredential(
            user,
            emailAuthCredential
          );

          // then, we update the user's email address
          await updateEmail(user, data.email);

          // finally, we re-create the server token
          const idToken = await credential.user.getIdToken(true);
          const csrfToken = getCsrfToken();
          const body = { idToken, csrfToken };

          await signIn(body);
        } catch (e) {
          setError((e as FirebaseError).message);

          return Promise.reject(e);
        } finally {
          resetState();
        }
      }
    },
    [setError, setLoading, user, getCsrfToken, resetState, signIn]
  );

  return [useUpdateUserEmailCallback, state] as [
    typeof useUpdateUserEmailCallback,
    typeof state
  ];
}
