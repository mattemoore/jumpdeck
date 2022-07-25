import { useCallback } from 'react';
import { User, updatePassword } from 'firebase/auth';
import { useRequestState } from '~/core/hooks/use-request-state';

export function useUpdatePassword() {
  const { state, setLoading, setData, setError } = useRequestState<void>();

  const updatePasswordCallback = useCallback(
    async (user: User, newPassword: string) => {
      if (!newPassword) {
        return;
      }

      try {
        setLoading(true);

        await updatePassword(user, newPassword);

        setData();
      } catch (e) {
        setError(`Could not update Password`);
      }
    },
    [setData, setError, setLoading]
  );

  return [updatePasswordCallback, state] as [
    typeof updatePasswordCallback,
    typeof state
  ];
}
