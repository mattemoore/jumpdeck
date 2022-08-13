import { getAnalytics, setUserId } from 'firebase/analytics';
import { useEffect } from 'react';

import { isBrowser } from '~/core/generic';
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

    const analytics = getAnalytics();

    if (userId) {
      setUserId(analytics, userId);
    }
  }, [userId]);
}
