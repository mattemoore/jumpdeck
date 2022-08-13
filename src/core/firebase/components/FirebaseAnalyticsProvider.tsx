import { AnalyticsProvider } from 'reactfire';
import { getAnalytics } from 'firebase/analytics';
import { isBrowser } from '~/core/generic';
import configuration from '~/configuration';

const FirebaseAnalyticsProvider: React.FCC = ({ children }) => {
  const isEmulator = configuration.emulator;

  if (!isBrowser() || isEmulator) {
    return <>{children}</>;
  }

  const sdk = getAnalytics();

  return <AnalyticsProvider sdk={sdk}>{children}</AnalyticsProvider>;
};

export default FirebaseAnalyticsProvider;
