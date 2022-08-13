import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { withAppProps } from '~/lib/props/with-app-props';
import Heading from '~/core/ui/Heading';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import UpdateOrganizationForm from '~/components/organizations/UpdateOrganizationForm';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import SettingsPageContainer from '~/components/SettingsPageContainer';
import { OrganizationContext } from '~/lib/contexts/organization';

const Organization = () => {
  return (
    <FirebaseStorageProvider>
      <Head>
        <title key="title">Organization Settings</title>
      </Head>

      <SettingsPageContainer title={'Settings'}>
        <OrganizationSettingsTabs />

        <div className={'w-full md:w-10/12'}>
          <div className={'flex w-full flex-col space-y-4'}>
            <Heading type={3}>
              <Trans i18nKey={'organization:settingsPageLabel'} />
            </Heading>

            <OrganizationContext.Consumer>
              {() => <UpdateOrganizationForm />}
            </OrganizationContext.Consumer>
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
