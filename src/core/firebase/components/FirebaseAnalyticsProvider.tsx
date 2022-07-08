import { getAnalytics } from 'firebase/analytics';
import { AnalyticsProvider } from 'reactfire';

import { isBrowser } from '~/core/generic';

const FirebaseAnalyticsProvider: React.FCC = ({ children }) => {
  const sdk = isBrowser() ? getAnalytics() : undefined;

  if (!sdk) {
    return <>{children}</>;
  }

  return <AnalyticsProvider sdk={sdk}>{children}</AnalyticsProvider>;
};

export default FirebaseAnalyticsProvider;
