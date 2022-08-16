import { AppCheckProvider, useFirebaseApp } from 'reactfire';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import configuration from '~/configuration';
import { isBrowser } from '~/core/generic';

const FirebaseAppCheckProvider: React.FCC = ({ children }) => {
  const siteKey = configuration.appCheckSiteKey;
  const app = useFirebaseApp();

  if (!siteKey || !isBrowser() || configuration.emulator) {
    return <>{children}</>;
  }

  /**
   * When running in a dev environment using a real Firebase project, we need to
   * make sure to attach the Firebase Debug Token generated from the console
   * so to disable real requests to Google Recapctha v3
   */
  if (!configuration.production) {
    attachAppCheckDebugToken();
  }

  const provider = new ReCaptchaV3Provider(siteKey);

  const sdk = initializeAppCheck(app, {
    provider,
    isTokenAutoRefreshEnabled: true,
  });

  return <AppCheckProvider sdk={sdk}>{children}</AppCheckProvider>;
};

export default FirebaseAppCheckProvider;

function attachAppCheckDebugToken() {
  const token = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;

  Object.assign(window, {
    FIREBASE_APPCHECK_DEBUG_TOKEN: token,
  });
}
