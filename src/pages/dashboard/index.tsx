import { GetServerSidePropsContext } from 'next';
import { withAppProps } from '~/lib/props/with-app-props';

import RouteShell from '~/components/RouteShell';

const Dashboard = () => {
  return <RouteShell title={'Dashboard'}></RouteShell>;
};

export default Dashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
