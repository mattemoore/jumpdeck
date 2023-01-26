import { useCallback, useEffect } from 'react';
import Router from 'next/router';

import { isBrowser } from '~/core/generic/is-browser';

/**
 * @name useTrackScreenViews
 * @description tracks screens to Analytics when a new route is loaded
 */
export function useTrackScreenViews() {
  const onRouteChangeComplete = useCallback(async () => {
    if (!isBrowser()) {
      return;
    }

    const { getAnalytics, logEvent } = await import('firebase/analytics');
    const title = document.title;

    logEvent(getAnalytics(), 'screen_view', {
      firebase_screen: title,
      firebase_screen_class: title,
    });
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [onRouteChangeComplete]);
}
