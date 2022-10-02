import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';

const DashboardDemo = dynamic(
  () => import('~/components/dashboard/DashboardDemo'),
  {
    ssr: false,
  }
);

const Dashboard = () => {
  return (
    <RouteShell title={'Dashboard'}>
      <DashboardDemo />
    </RouteShell>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
