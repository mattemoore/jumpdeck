import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { useUserSession } from '~/lib/hooks/use-user-session';
import { withAppProps } from '~/lib/props/with-app-props';

import UpdateEmailForm from '~/components/profile/UpdateEmailForm';
import RouteShell from '~/components/RouteShell';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';

import Heading from '~/core/ui/Heading';

const ProfileEmailSettings = () => {
  const userSession = useUserSession();
  const user = userSession?.auth;

  if (!user) {
    return null;
  }

  return (
    <RouteShell title={'Profile'}>
      <Head>
        <title key={'title'}>Update Email</title>
      </Head>

      <div className={'flex space-x-8'}>
        <ProfileSettingsTabs user={user} />

        <div className={'flex flex-col space-y-4'}>
          <Heading type={3}>
            <Trans i18nKey={'profile:emailTab'} />
          </Heading>

          <UpdateEmailForm user={user} />
        </div>
      </div>
    </RouteShell>
  );
};

export default ProfileEmailSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
