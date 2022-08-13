import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { useUserSession } from '~/core/hooks/use-user-session';
import { withAppProps } from '~/lib/props/with-app-props';

import UpdateEmailForm from '~/components/profile/UpdateEmailForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';

import Heading from '~/core/ui/Heading';
import SettingsPageContainer from '~/components/SettingsPageContainer';

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

        <div className={'w-full w-10/12'}>
          <div className={'flex flex-col space-y-4'}>
            <Heading type={3}>
              <Trans i18nKey={'profile:emailTab'} />
            </Heading>

            <UpdateEmailForm user={user} />
          </div>
        </div>
      </SettingsPageContainer>
    </>
  );
};

export default ProfileEmailSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
