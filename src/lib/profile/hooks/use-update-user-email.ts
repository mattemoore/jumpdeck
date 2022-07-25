import { useCallback } from 'react';
import { useUser } from 'reactfire';
import { FirebaseError } from 'firebase/app';

import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '@firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';

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
  const { state, setLoading, setData, setError } = useRequestState<void>();

  const useUpdateUserEmailCallback = useCallback(
    async (data: Data) => {
      if (data && user) {
        setLoading(true);

        const credential = EmailAuthProvider.credential(
          data.oldEmail,
          data.password
        );

        try {
          await reauthenticateWithCredential(user, credential);
          await updateEmail(user, data.email);

          setData();
        } catch (e) {
          setError((e as FirebaseError).message);
        }
      }
    },
    [setData, setError, setLoading, user]
  );

  return [useUpdateUserEmailCallback, state] as [
    typeof useUpdateUserEmailCallback,
    typeof state
  ];
}
