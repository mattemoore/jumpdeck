import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';
import Heading from '~/core/ui/Heading';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import UpdateOrganizationForm from '~/components/organizations/UpdateOrganizationForm';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import Head from 'next/head';

const Organization = () => {
  return (
    <FirebaseStorageProvider>
      <Head>
        <title key="title">Organization Settings</title>
      </Head>

      <RouteShell title={'Organization'}>
        <div
          className={
            'flex flex-col space-y-4 sm:space-y-0 sm:flex-row' +
            ' sm:space-x-12'
          }
        >
          <OrganizationSettingsTabs />

          <div className={'flex flex-col space-y-4'}>
            <Heading type={3}>
              <Trans i18nKey={'organization:settingsPageLabel'} />
            </Heading>

            <UpdateOrganizationForm />
          </div>
        </div>
      </RouteShell>
    </FirebaseStorageProvider>
  );
};

export default Organization;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
