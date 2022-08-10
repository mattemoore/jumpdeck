import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import configuration from '~/configuration';

import FirebaseFirestoreProvider from '~/core/firebase/components/FirebaseFirestoreProvider';
import RouteShellWithTopNavigation from './layouts/header/RouteShellWithTopNavigation';
import RouteShellWithSidebar from './layouts/sidebar/RouteShellWithSidebar';

import GuardedPage from '~/core/firebase/components/GuardedPage';
import SentryProvider from '~/components/SentryProvider';
import { LayoutStyle } from '~/core/layout-style';

const RouteShell: React.FCC<{
  title: string;
  style?: LayoutStyle;
}> = ({ title, style, children }) => {
  const redirectPathWhenSignedOut = '/';
  const layout = style ?? configuration.navigation.style;

  return (
    <>
      <Head>
        <title key="title">{title}</title>
      </Head>

      <FirebaseFirestoreProvider>
        <GuardedPage whenSignedOut={redirectPathWhenSignedOut}>
          <SentryProvider>
            <Toaster />

            <LayoutRenderer style={layout} title={title}>
              {children}
            </LayoutRenderer>
          </SentryProvider>
        </GuardedPage>
      </FirebaseFirestoreProvider>
    </>
  );
};

function LayoutRenderer(
  props: React.PropsWithChildren<{
    title: string;
    style: LayoutStyle;
  }>
) {
  switch (props.style) {
    case LayoutStyle.Sidebar:
      return (
        <RouteShellWithSidebar title={props.title}>
          {props.children}
        </RouteShellWithSidebar>
      );

    case LayoutStyle.TopHeader:
      return (
        <RouteShellWithTopNavigation title={props.title}>
          {props.children}
        </RouteShellWithTopNavigation>
      );

    case LayoutStyle.Custom:
      return <>{props.children}</>;
  }
}

export default RouteShell;
