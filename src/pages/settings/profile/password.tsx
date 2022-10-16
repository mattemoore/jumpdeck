import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';
import { EmailAuthProvider } from 'firebase/auth';

import { withAppProps } from '~/lib/props/with-app-props';
import { useUserSession } from '~/core/hooks/use-user-session';

import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

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

  const canUpdatePassword = user.providerData.find(
    (item) => item.providerId === EmailAuthProvider.PROVIDER_ID
  );

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key={'title'}>Update Password</title>
      </Head>

      <ProfileSettingsTabs />

      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'profile:passwordTab'} />}
          subHeading={<Trans i18nKey={'profile:passwordTabSubheading'} />}
        >
          <If
            condition={canUpdatePassword}
            fallback={<WarnCannotUpdatePasswordAlert />}
          >
            <UpdatePasswordForm user={user} />
          </If>
        </SettingsTile>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

function WarnCannotUpdatePasswordAlert() {
  return (
    <Alert type={'warn'}>
      <Trans i18nKey={'profile:cannotUpdatePassword'} />
    </Alert>
  );
}

export default ProfilePasswordSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
