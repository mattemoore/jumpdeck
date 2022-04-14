import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { withAppProps } from '~/lib/props/with-app-props';

import RouteShell from '~/components/RouteShell';

const Dashboard = () => {
  return (
    <RouteShell title={'Dashboard'}>
      <Head>
        <title key={'title'}>Dashboard</title>
      </Head>
    </RouteShell>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
