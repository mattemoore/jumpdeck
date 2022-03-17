import { useUser } from 'reactfire';
import { updateProfile } from '@firebase/auth';
import { useRequestState } from '~/core/hooks/use-request-state';

type Info = {
  displayName: string | null;
  photoURL: string | null;
};

export function useUpdateProfile() {
  const { data: user } = useUser();
  const { state, setLoading, setData, setError } = useRequestState<void>();

  async function fn(info: Maybe<Info>) {
    if (info && user) {
      setLoading(true);

      try {
        await updateProfile(user, info);

        setData();
      } catch {
        setError(`Could not update Profile`);
      }
    }
  }

  return [fn, state] as [typeof fn, typeof state];
}
