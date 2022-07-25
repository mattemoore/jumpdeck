import { useCallback, useContext } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { Trans } from 'next-i18next';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import Heading from '~/core/ui/Heading';

import { withAppProps } from '~/lib/props/with-app-props';
import { UserSessionContext } from '~/lib/contexts/session';

import UpdateProfileForm from '~/components/profile/UpdateProfileForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsPageContainer from '~/components/SettingsPageContainer';

type ProfileData = {
  photoURL: string | null;
  displayName: string | null;
};

const Profile = () => {
  const { userSession, setUserSession } = useContext(UserSessionContext);

  const onUpdate = useCallback(
    (data: ProfileData) => {
      const authData = userSession?.auth;

      if (authData) {
        setUserSession({
          auth: {
            ...authData,
            ...data,
          },
          data: userSession.data,
        });
      }
    },
    [setUserSession, userSession]
  );

  if (!userSession?.auth) {
    return null;
  }

  return (
    <>
      <Head>
        <title key={'title'}>Update Profile</title>
      </Head>

      <FirebaseStorageProvider>
        <SettingsPageContainer title={'Profile'}>
          <ProfileSettingsTabs user={userSession.auth} />

          <div className={'w-full md:w-9/12'}>
            <div className={'flex flex-col space-y-4'}>
              <Heading type={3}>
                <Trans i18nKey={'profile:generalTab'} />
              </Heading>

              <UpdateProfileForm user={userSession.auth} onUpdate={onUpdate} />
            </div>
          </div>
        </SettingsPageContainer>
      </FirebaseStorageProvider>
    </>
  );
};

export default Profile;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
