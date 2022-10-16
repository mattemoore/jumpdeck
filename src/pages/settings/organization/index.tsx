import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { withAppProps } from '~/lib/props/with-app-props';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import UpdateOrganizationForm from '~/components/organizations/UpdateOrganizationForm';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';

const Organization = () => {
  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key="title">Organization Settings</title>
      </Head>

      <OrganizationSettingsTabs />

      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'organization:generalTabLabel'} />}
          subHeading={
            <Trans i18nKey={'organization:generalTabLabelSubheading'} />
          }
        >
          <FirebaseStorageProvider>
            <UpdateOrganizationForm />
          </FirebaseStorageProvider>
        </SettingsTile>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

export default Organization;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
