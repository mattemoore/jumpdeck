import '../styles/index.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import type { User as AuthUser } from 'firebase/auth';
import { appWithTranslation, SSRConfig } from 'next-i18next';

import configuration from '~/configuration';

import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';
import FirebaseAppCheckProvider from '~/core/firebase/components/FirebaseAppCheckProvider';
import FirebaseAnalyticsProvider from '~/core/firebase/components/FirebaseAnalyticsProvider';

import { loadSelectedTheme } from '~/core/theming';
import { isBrowser } from '~/core/generic';

import { Organization } from '~/lib/organizations/types/organization';
import { OrganizationContext } from '~/lib/contexts/organization';
import { UserData } from '~/core/session/types/user-data';
import { UserSessionContext } from '~/core/session/contexts/user-session';
import { UserSession } from '~/core/session/types/user-session';

interface DefaultPageProps extends SSRConfig {
  session?: Maybe<AuthUser>;
  user?: Maybe<UserData>;
  organization?: Maybe<WithId<Organization>>;
  csrfToken?: string;
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

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext.auth) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentOrganization, [updateCurrentOrganization]);
  useEffect(updateCurrentUser, [updateCurrentUser]);

  return (
    <FirebaseAppShell config={firebase}>
      <FirebaseAppCheckProvider>
        <FirebaseAuthProvider
          userSession={userSession}
          setUserSession={setUserSession}
          useEmulator={emulator}
        >
          <FirebaseAnalyticsProvider>
            <UserSessionContext.Provider
              value={{ userSession, setUserSession }}
            >
              <OrganizationContext.Provider
                value={{ organization, setOrganization }}
              >
                <CsrfTokenMetaAttribute csrfToken={pageProps.csrfToken} />
                <Component {...pageProps} />
              </OrganizationContext.Provider>
            </UserSessionContext.Provider>
          </FirebaseAnalyticsProvider>
        </FirebaseAuthProvider>
      </FirebaseAppCheckProvider>
    </FirebaseAppShell>
  );
}

export default appWithTranslation<AppProps & { pageProps: DefaultPageProps }>(
  App
);

function CsrfTokenMetaAttribute({ csrfToken }: { csrfToken: Maybe<string> }) {
  if (!csrfToken) {
    return null;
  }

  return (
    <Head>
      <meta name={'csrf-token'} content={csrfToken} />
    </Head>
  );
}

/**
 * Load selected theme
 * Do not add it as an effect to _app.tsx, the flashing is very visible
 */
if (isBrowser()) {
  loadSelectedTheme();
}
