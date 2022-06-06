import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';

import If from '~/core/ui/If';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

function AppRouteLoadingIndicator({ children }: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const onRouteChangeStartCallback = useCallback(() => setLoading(true), []);

  const onRouteChangeCompleteCallback = useCallback(
    () => setLoading(false),
    []
  );

  useEffect(() => {
    Router.events.on('routeChangeStart', onRouteChangeStartCallback);
    Router.events.on('routeChangeComplete', onRouteChangeCompleteCallback);
    Router.events.on('routeChangeError', onRouteChangeCompleteCallback);

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStartCallback);
      Router.events.off('routeChangeComplete', onRouteChangeCompleteCallback);
      Router.events.off('routeChangeError', onRouteChangeCompleteCallback);
    };
  }, [onRouteChangeCompleteCallback, onRouteChangeStartCallback]);

  return (
    <If condition={loading}>
      <PageLoadingIndicator fullPage={true}>
        <>{children}</>
      </PageLoadingIndicator>
    </If>
  );
}

export default AppRouteLoadingIndicator;
