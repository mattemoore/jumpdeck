import { useEffect } from 'react';

import { isBrowser } from '~/core/generic/is-browser';
import { useUserSession } from '~/core/hooks/use-user-session';

/**
 * @name useTrackSignedInUser
 * @description tracks the current user ID
 */
export function useTrackSignedInUser() {
  const user = useUserSession();
  const userId = user?.auth?.uid;

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    void (async () => {
      const { getAnalytics, setUserId } = await import('firebase/analytics');

      if (userId) {
        setUserId(getAnalytics(), userId);
      }
    })();
  }, [userId]);
}
