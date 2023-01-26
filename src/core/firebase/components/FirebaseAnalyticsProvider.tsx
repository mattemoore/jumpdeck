import { AnalyticsProvider, useInitAnalytics } from 'reactfire';

import configuration from '~/configuration';
import { useAnalyticsTracking } from '~/core/firebase/hooks/use-analytics-tracking';
import { isBrowser } from '~/core/generic/is-browser';

const FirebaseAnalyticsProvider: React.FCC = ({ children }) => {
  const isEmulator = configuration.emulator;

  if (isEmulator || !isBrowser()) {
    return <>{children}</>;
  }

  return (
    <BrowserFirebaseAnalyticsProvider>
      {children}
    </BrowserFirebaseAnalyticsProvider>
  );
};

function BrowserFirebaseAnalyticsProvider(props: React.PropsWithChildren) {
  const { data: sdk, status } = useInitAnalytics(async (app) => {
    const { getAnalytics } = await import('firebase/analytics');

    return getAnalytics(app);
  });

  if (status !== 'success') {
    return <>{props.children}</>;
  }

  return (
    <AnalyticsProvider sdk={sdk}>
      <AnalyticsTrackingEventsProvider>
        {props.children}
      </AnalyticsTrackingEventsProvider>
    </AnalyticsProvider>
  );
}

function AnalyticsTrackingEventsProvider({
  children,
}: React.PropsWithChildren) {
  useAnalyticsTracking();

  return <>{children}</>;
}

export default FirebaseAnalyticsProvider;
