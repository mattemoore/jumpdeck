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
import { UserData } from '~/lib/organizations/types/user-data';
import { UserSessionContext } from '~/lib/contexts/session';
import { UserSession } from '~/lib/organizations/types/user-session';
import { loadSelectedTheme } from "~/core/theming";

interface DefaultPageProps {
  session?: Maybe<AuthUser>;
  user?: Maybe<UserData>;
  organization?: Maybe<WithId<Organization>>;
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

  useEffect(() => {
    loadSelectedTheme();
  }, []);

  return (
    <FirebaseAppShell config={firebase}>
      <FirebaseAuthProvider
        userSession={userSession}
        setUserSession={setUserSession}
        useEmulator={emulator}
      >
        <UserSessionContext.Provider value={{ userSession, setUserSession }}>
          <OrganizationContext.Provider
            value={{ organization, setOrganization }}
          >
            <Component {...pageProps} />
          </OrganizationContext.Provider>
        </UserSessionContext.Provider>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
}

export default appWithTranslation<AppProps & { pageProps: DefaultPageProps }>(
  App
);
