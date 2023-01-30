import { createRef, useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

function AppRouteLoadingIndicator() {
  const ref = createRef<LoadingBarRef>();
  const [loading, setLoading] = useState(false);

  const onRouteChangeStartCallback = useCallback(() => {
    setLoading(true);
  }, []);

  const onRouteChangeCompleteCallback = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [loading, ref]);

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
    <LoadingBar
      height={4}
      waitingTime={200}
      shadow={true}
      className={'bg-primary-500'}
      color={''}
      ref={ref}
    />
  );
}

export default AppRouteLoadingIndicator;
