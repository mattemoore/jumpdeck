import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';
import Heading from '~/core/ui/Heading';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import UpdateOrganizationForm from '~/components/organizations/UpdateOrganizationForm';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import Head from 'next/head';
import SettingsPageContainer from '~/components/SettingsPageContainer';

const Organization = () => {
  return (
    <FirebaseStorageProvider>
      <Head>
        <title key="title">Organization Settings</title>
      </Head>

      <SettingsPageContainer title={'Organization'}>
        <div className={'flex justify-between'}>
          <OrganizationSettingsTabs />

          <div className={'w-full md:w-9/12'}>
            <div className={'flex w-full flex-col space-y-4'}>
              <Heading type={3}>
                <Trans i18nKey={'organization:settingsPageLabel'} />
              </Heading>

              <UpdateOrganizationForm />
            </div>
          </div>
        </div>
      </SettingsPageContainer>
    </FirebaseStorageProvider>
  );
};

export default Organization;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
