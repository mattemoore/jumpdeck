import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import { Transition } from '@headlessui/react';

import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

function AppRouteLoadingIndicator({ children }: React.PropsWithChildren) {
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
    <Transition
      appear={loading}
      show={loading}
      enter="transition-opacity duration-150"
      enterFrom="opacity-40"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <PageLoadingIndicator fullPage={true}>
        <>{children}</>
      </PageLoadingIndicator>
    </Transition>
  );
}

export default AppRouteLoadingIndicator;
