import { AnalyticsProvider, useInitAnalytics } from 'reactfire';

import { isBrowser } from '~/core/generic';
import configuration from '~/configuration';

const FirebaseAnalyticsProvider: React.FCC = ({ children }) => {
  const { data: sdk } = useInitAnalytics(async (app) => {
    const isEmulator = configuration.emulator;

    if (!isBrowser() || isEmulator) {
      return { app };
    }

    const { getAnalytics } = await import('firebase/analytics');

    return getAnalytics(app);
  });

  if (!sdk) {
    return <>{children}</>;
  }

  return <AnalyticsProvider sdk={sdk}>{children}</AnalyticsProvider>;
};

export default FirebaseAnalyticsProvider;
