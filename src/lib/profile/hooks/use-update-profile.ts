import { useCallback } from 'react';
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

  const updateProfileCallback = useCallback(
    async (info: Maybe<Info>) => {
      if (info && user) {
        setLoading(true);

        try {
          await updateProfile(user, info);

          setData();
        } catch {
          setError(`Could not update Profile`);
        }
      }
    },
    [setData, setError, setLoading, user]
  );

  return [updateProfileCallback, state] as [
    typeof updateProfileCallback,
    typeof state
  ];
}
