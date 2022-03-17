import { useContext } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { Trans } from 'next-i18next';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import Heading from '~/core/ui/Heading';

import { withAppProps } from '~/lib/props/with-app-props';
import { UserSessionContext } from '~/lib/contexts/session';

import UpdateProfileForm from '~/components/profile/UpdateProfileForm';
import RouteShell from '~/components/RouteShell';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';

type ProfileData = {
  photoURL: string | null;
  displayName: string | null;
};

const Profile = () => {
  const { userSession, setUserSession } = useContext(UserSessionContext);

  if (!userSession?.auth) {
    return null;
  }

  const onUpdate = (data: ProfileData) => {
    const authData = userSession.auth;

    if (authData) {
      setUserSession({
        auth: {
          ...authData,
          ...data,
        },
        data: userSession.data,
      });
    }
  };

  return (
    <FirebaseStorageProvider>
      <Head>
        <title key={'title'}>Update Profile</title>
      </Head>

      <RouteShell title={'Profile'}>
        <div
          className={
            'flex flex-col space-y-4 sm:space-y-0 sm:flex-row' +
            ' sm:space-x-12'
          }
        >
          <ProfileSettingsTabs user={userSession.auth} />

          <div className={'flex flex-col space-y-4'}>
            <Heading type={3}>
              <Trans i18nKey={'profile:generalTab'} />
            </Heading>

            <UpdateProfileForm user={userSession.auth} onUpdate={onUpdate} />
          </div>
        </div>
      </RouteShell>
    </FirebaseStorageProvider>
  );
};

export default Profile;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
