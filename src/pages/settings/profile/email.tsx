import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { useUserSession } from '~/core/hooks/use-user-session';
import { withAppProps } from '~/lib/props/with-app-props';

import UpdateEmailForm from '~/components/profile/UpdateEmailForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';

import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';

const ProfileEmailSettings = () => {
  const userSession = useUserSession();
  const user = userSession?.auth;

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title key={'title'}>Update Email</title>
      </Head>

      <SettingsPageContainer title={'Settings'}>
        <ProfileSettingsTabs user={user} />

        <SettingsContentContainer>
          <SettingsTile heading={<Trans i18nKey={'profile:emailTab'} />}>
            <UpdateEmailForm user={user} />
          </SettingsTile>
        </SettingsContentContainer>
      </SettingsPageContainer>
    </>
  );
};

export default ProfileEmailSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
