import Head from 'next/head';
import dynamic from 'next/dynamic';

import configuration from '~/configuration';
import { LayoutStyle } from '~/core/layout-style';
import Layout from '~/core/ui/Layout';

const ReactHotToast = dynamic(async () => {
  const { Toaster } = await import('react-hot-toast');

  return Toaster;
});

const FirebaseFirestoreProvider = dynamic(
  () => import('~/core/firebase/components/FirebaseFirestoreProvider')
);

const SentryProvider = dynamic(() => import('~/components/SentryProvider'));

const GuardedPage = dynamic(
  () => import('~/core/firebase/components/GuardedPage')
);

const RouteShellWithSidebar = dynamic(
  () => import('./layouts/sidebar/RouteShellWithSidebar')
);

const RouteShellWithTopNavigation = dynamic(
  () => import('./layouts/header/RouteShellWithTopNavigation')
);

const redirectPathWhenSignedOut = '/';

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
            <ReactHotToast />

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
    case LayoutStyle.Sidebar: {
      return (
        <RouteShellWithSidebar title={props.title}>
          {props.children}
        </RouteShellWithSidebar>
      );
    }

    case LayoutStyle.TopHeader: {
      return (
        <RouteShellWithTopNavigation title={props.title}>
          {props.children}
        </RouteShellWithTopNavigation>
      );
    }

    case LayoutStyle.Custom:
      return <>{props.children}</>;
  }
}

export default RouteShell;
