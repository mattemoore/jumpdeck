import { User, updatePassword } from 'firebase/auth';
import { useRequestState } from '~/core/hooks/use-request-state';

export function useUpdatePassword() {
  const { state, setLoading, setData, setError } = useRequestState<void>();

  async function fn(user: User, newPassword: string) {
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
  }

  return [fn, state] as [typeof fn, typeof state];
}
