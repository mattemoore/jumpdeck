import { useCallback, useEffect } from 'react';

import {
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

export function useUpdatePassword() {
  const { state, setLoading, setData, setError, resetState } =
    useRequestState<void>();

  const [signIn, signInState] = useCreateSession();
  const getCsrfToken = useCsrfToken();

  useEffect(() => {
    if (signInState.success) {
      setData();
    }
  }, [signInState.success, setData]);

  const updatePasswordCallback = useCallback(
    async (user: User, currentPassword: string, newPassword: string) => {
      try {
        setLoading(true);

        const email = user.email;

        if (!email) {
          return Promise.reject();
        }

        const emailAuthCredential = EmailAuthProvider.credential(
          email,
          currentPassword
        );

        // first, we check if the password is correct
        const credential = await reauthenticateWithCredential(
          user,
          emailAuthCredential
        );

        // then, we update the user password
        await updatePassword(user, newPassword);

        // finally, we re-create the server token
        const idToken = await credential.user.getIdToken(true);
        const csrfToken = getCsrfToken();
        const body = { idToken, csrfToken };

        await signIn(body);
      } catch (e) {
        setError(`Could not update Password`);

        return Promise.reject(e);
      } finally {
        resetState();
      }
    },
    [setError, setLoading, getCsrfToken, resetState, signIn]
  );

  return [updatePasswordCallback, state] as [
    typeof updatePasswordCallback,
    typeof state
  ];
}
