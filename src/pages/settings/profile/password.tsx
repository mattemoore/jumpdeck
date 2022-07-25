import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';

import Heading from '~/core/ui/Heading';

import { withAppProps } from '~/lib/props/with-app-props';
import { useUserSession } from '~/lib/hooks/use-user-session';

import UpdatePasswordForm from '~/components/profile/UpdatePasswordForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsPageContainer from '~/components/SettingsPageContainer';

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

      <SettingsPageContainer title={'Profile'}>
        <ProfileSettingsTabs user={user} />

        <div className={'w-full md:w-9/12'}>
          <div className={'flex flex-col space-y-4'}>
            <Heading type={3}>
              <Trans i18nKey={'organization:passwordSettingsTab'} />
            </Heading>

            <UpdatePasswordForm user={user} />
          </div>
        </div>
      </SettingsPageContainer>
    </>
  );
};

export default ProfilePasswordSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
