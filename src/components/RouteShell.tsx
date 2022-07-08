import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import configuration from '~/configuration';

import FirebaseFirestoreProvider from '~/core/firebase/components/FirebaseFirestoreProvider';
import RouteShellWithTopNavigation from './layouts/header/RouteShellWithTopNavigation';
import RouteShellWithSidebar from './layouts/sidebar/RouteShellWithSidebar';

import GuardedPage from '~/core/firebase/components/GuardedPage';
import If from '~/core/ui/If';
import SentryProvider from '~/components/SentryProvider';

const RouteShell: React.FCC<{
  title: string;
  style?: string;
}> = ({ title, style, children }) => {
  const redirectPathWhenSignedOut = '/';
  const navigationStyle = style ?? configuration.navigation.style;

  return (
    <FirebaseFirestoreProvider>
      <GuardedPage whenSignedOut={redirectPathWhenSignedOut}>
        <SentryProvider>
          <Head>
            <title key="title">{title}</title>
          </Head>

          <Toaster />

          <If condition={navigationStyle === 'topHeader'}>
            <RouteShellWithTopNavigation title={title}>
              {children}
            </RouteShellWithTopNavigation>
          </If>

          <If condition={navigationStyle === 'sidebar'}>
            <RouteShellWithSidebar title={title}>
              {children}
            </RouteShellWithSidebar>
          </If>

          <If condition={navigationStyle === 'custom'}>
            <>{children}</>
          </If>
        </SentryProvider>
      </GuardedPage>
    </FirebaseFirestoreProvider>
  );
};

export default RouteShell;
