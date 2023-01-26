import { AppCheckProvider, useFirebaseApp } from 'reactfire';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { useEffect, useMemo } from 'react';

import configuration from '~/configuration';
import { isBrowser } from '~/core/generic/is-browser';

const siteKey = configuration.appCheckSiteKey;

const FirebaseAppCheckProvider: React.FCC = ({ children }) => {
  const app = useFirebaseApp();

  const sdk = useMemo(() => {
    if (!siteKey || !isBrowser()) {
      return;
    }

    const provider = new ReCaptchaV3Provider(siteKey);

    return initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  }, [app]);

  useEffect(() => {
    /**
     * When running in a dev environment using a real Firebase project, we need to
     * make sure to attach the Firebase Debug Token generated from the console
     * so to disable real requests to Google Recaptcha v3
     */
    if (!configuration.production) {
      attachAppCheckDebugToken();
    }
  }, []);

  if (!sdk) {
    return <>{children}</>;
  }

  return <AppCheckProvider sdk={sdk}>{children}</AppCheckProvider>;
};

export default FirebaseAppCheckProvider;

function attachAppCheckDebugToken() {
  const token = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;

  Object.assign(window, {
    FIREBASE_APPCHECK_DEBUG_TOKEN: token,
  });
}
