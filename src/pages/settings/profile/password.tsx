import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';
import { useUserSession } from '~/core/hooks/use-user-session';

import UpdatePasswordForm from '~/components/profile/UpdatePasswordForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';

const ProfilePasswordSettings = () => {
  const userSession = useUserSession();
  const user = userSession?.auth;

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title key={'title'}>Update Password</title>
      </Head>

      <SettingsPageContainer title={'Settings'}>
        <ProfileSettingsTabs user={user} />

        <SettingsContentContainer>
          <SettingsTile
            heading={<Trans i18nKey={'organization:passwordSettingsTab'} />}
          >
            <UpdatePasswordForm user={user} />
          </SettingsTile>
        </SettingsContentContainer>
      </SettingsPageContainer>
    </>
  );
};

export default ProfilePasswordSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
