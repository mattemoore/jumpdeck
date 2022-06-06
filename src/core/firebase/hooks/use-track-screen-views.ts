import { useCallback, useEffect } from 'react';
import { getAnalytics, logEvent } from 'firebase/analytics';
import Router from 'next/router';

import { isBrowser } from '~/core/generic';

/**
 * @name useTrackScreenViews
 * @description tracks screens to Analytics when a new route is loaded
 */
export function useTrackScreenViews() {
  const onRouteChangeComplete = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    const analytics = getAnalytics();
    const title = document.title;

    logEvent(analytics, 'screen_view', {
      firebase_screen: title,
      firebase_screen_class: title,
    });
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  });
}
