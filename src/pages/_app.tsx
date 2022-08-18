import '../styles/index.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppProps } from 'next/app';

import type { User as AuthUser } from 'firebase/auth';
import { appWithTranslation } from 'next-i18next';

import configuration from '~/configuration';

import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';

import { Organization } from '~/lib/organizations/types/organization';
import { OrganizationContext } from '~/lib/contexts/organization';
import { UserData } from '~/core/session/types/user-data';
import { UserSessionContext } from '~/core/session/contexts/user-session';
import { UserSession } from '~/core/session/types/user-session';
import { loadSelectedTheme } from '~/core/theming';

import { useAnalyticsTracking } from '~/core/firebase/hooks/use-analytics-tracking';
import FirebaseAnalyticsProvider from '~/core/firebase/components/FirebaseAnalyticsProvider';
import { isBrowser } from '~/core/generic';

interface DefaultPageProps {
  session?: Maybe<AuthUser>;
  user?: Maybe<UserData>;
  organization?: Maybe<WithId<Organization>>;
  refreshClaims?: boolean;
}

function App(
  props: AppProps<DefaultPageProps> & { pageProps: DefaultPageProps }
) {
  const { Component } = props;
  const pageProps = props.pageProps as DefaultPageProps;
  const { emulator, firebase } = configuration;

  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: pageProps.session,
      data: pageProps.user,
    };
  }, [pageProps]);

  const [organization, setOrganization] = useState<
    DefaultPageProps['organization']
  >(pageProps.organization);

  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  const updateCurrentOrganization = useCallback(() => {
    setOrganization(pageProps.organization);
  }, [pageProps.organization]);

  useEffect(updateCurrentOrganization, [updateCurrentOrganization]);

  return (
    <FirebaseAppShell config={firebase}>
      <FirebaseAuthProvider
        refreshClaims={props.pageProps.refreshClaims}
        userSession={userSession}
        setUserSession={setUserSession}
        useEmulator={emulator}
      >
        <FirebaseAnalyticsProvider>
          <UserSessionContext.Provider value={{ userSession, setUserSession }}>
            <OrganizationContext.Provider
              value={{ organization, setOrganization }}
            >
              <AnalyticsTrackingEventsProvider>
                <Component {...pageProps} />
              </AnalyticsTrackingEventsProvider>
            </OrganizationContext.Provider>
          </UserSessionContext.Provider>
        </FirebaseAnalyticsProvider>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
}

export default appWithTranslation<AppProps & { pageProps: DefaultPageProps }>(
  App
);

function AnalyticsTrackingEventsProvider({
  children,
}: React.PropsWithChildren) {
  function InnerAnalyticsProvider() {
    useAnalyticsTracking();

    return <>{children}</>;
  }

  const shouldUseAnalytics = isBrowser() && !configuration.emulator;

  return shouldUseAnalytics ? <InnerAnalyticsProvider /> : <>{children}</>;
}

/**
 * Load selected theme
 * Do not add it as an effect to _app.tsx, the flashing is very visible
 */
if (isBrowser()) {
  loadSelectedTheme();
}
