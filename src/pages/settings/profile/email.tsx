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
import { EmailAuthProvider } from 'firebase/auth';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

const ProfileEmailSettings = () => {
  const userSession = useUserSession();
  const user = userSession?.auth;

  if (!user) {
    return null;
  }

  const canUpdateEmail = user.providerData.find(
    (item) => item.providerId === EmailAuthProvider.PROVIDER_ID
  );

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key={'title'}>Update Email</title>
      </Head>

      <ProfileSettingsTabs />

      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'profile:emailTab'} />}
          subHeading={<Trans i18nKey={'profile:emailTabTabSubheading'} />}
        >
          <If
            condition={canUpdateEmail}
            fallback={<WarnCannotUpdateEmailAlert />}
          >
            <UpdateEmailForm user={user} />
          </If>
        </SettingsTile>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

function WarnCannotUpdateEmailAlert() {
  return (
    <Alert type={'warn'}>
      <Trans i18nKey={'profile:cannotUpdateEmail'} />
    </Alert>
  );
}

export default ProfileEmailSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
