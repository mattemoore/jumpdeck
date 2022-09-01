import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

import configuration from '~/configuration';

import FirebaseFirestoreProvider from '~/core/firebase/components/FirebaseFirestoreProvider';

import GuardedPage from '~/core/firebase/components/GuardedPage';
import { LayoutStyle } from '~/core/layout-style';
import Layout from '~/core/ui/Layout';

const redirectPathWhenSignedOut = '/';

const SentryProvider = dynamic(() => import('~/components/SentryProvider'), {
  ssr: false,
});

const RouteShellWithTopNavigation = dynamic(
  () => import('./layouts/header/RouteShellWithTopNavigation')
);

const RouteShellWithSidebar = dynamic(
  () => import('./layouts/sidebar/RouteShellWithSidebar')
);

const RouteShell: React.FCC<{
  title: string;
  style?: LayoutStyle;
}> = ({ title, style, children }) => {
  const layout = style ?? configuration.navigation.style;

  return (
    <FirebaseFirestoreProvider>
      <Head>
        <title key="title">{title}</title>
      </Head>

      <GuardedPage whenSignedOut={redirectPathWhenSignedOut}>
        <SentryProvider>
          <Layout>
            <Toaster />

            <LayoutRenderer style={layout} title={title}>
              {children}
            </LayoutRenderer>
          </Layout>
        </SentryProvider>
      </GuardedPage>
    </FirebaseFirestoreProvider>
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
