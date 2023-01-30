import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Trans } from 'next-i18next';
import { GetServerSidePropsContext } from 'next';
import { User, MultiFactorInfo } from 'firebase/auth';
import { useRouter } from 'next/router';

import { withAppProps } from '~/lib/props/with-app-props';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';
import ConnectedAccountsContainer from '~/components/profile/accounts/ConnectedAccountsContainer';
import MultiFactorAuthSetupContainer from '~/components/profile/mfa/MultiFactorAuthSetupContainer';
import DisableMultiFactorButton from '~/components/profile/mfa/DisableMultiFactorButton';
import ReauthenticationModal from '~/components/auth/ReauthenticationModal';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

import configuration from '~/configuration';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

const ProfileAuthenticationPage: React.FC<{
  session: User & { multiFactor: MultiFactorInfo[] };
}> = (props) => {
  const multiFactor = props.session.multiFactor;
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [shouldReauthenticate, setShouldReauthenticate] = useState(false);

  const refreshPage = useCallback(
    (success: boolean) => {
      if (success) {
        setRefreshing(true);

        // this little trick forces the page to refresh
        // it's quick & dirty way to provide UI feedback with the updated
        // user data when enabling/disabling MFA
        return router.replace(router.asPath);
      }
    },
    [router]
  );

  useEffect(() => {
    // when the new props are fetched, stop showing the spinner
    setRefreshing(false);
  }, [props]);

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key={'title'}>Authentication</title>
      </Head>

      <If condition={refreshing}>
        <PageLoadingIndicator />
      </If>

      <ProfileSettingsTabs />

      <SettingsContentContainer>
        <div className={'flex flex-col space-y-8'}>
          <SettingsTile
            heading={<Trans i18nKey={'profile:manageConnectedAccounts'} />}
            subHeading={
              <Trans i18nKey={'profile:manageConnectedAccountsSubheading'} />
            }
          >
            <ConnectedAccountsContainer />
          </SettingsTile>

          {/* DISPLAY TILE IF APP SUPPORTS MFA */}
          <If condition={configuration.auth.enableMultiFactorAuth}>
            <SettingsTile
              heading={<Trans i18nKey={'profile:multiFactorAuth'} />}
              subHeading={
                <Trans i18nKey={'profile:multiFactorAuthSubheading'} />
              }
            >
              {/* MFA DISABLED BY USER: SHOW SETUP CONTAINER */}
              <If condition={!multiFactor}>
                <MultiFactorAuthSetupContainer onComplete={refreshPage} />
              </If>

              {/* MFA ENABLED BY USER: SHOW DISABLE BUTTON */}
              <If condition={multiFactor}>
                <div className={'flex flex-col space-y-2'}>
                  <MultiFactorSuccessAlert />

                  <DisableMultiFactorButton
                    onDisable={async () => {
                      // After the user Disables MFA, Firebase will revoke the
                      // session cookie permissions. We must ask the user
                      // to reauthenticate
                      setShouldReauthenticate(true);
                    }}
                  />
                </div>
              </If>

              <If condition={shouldReauthenticate}>
                <ReauthenticationModal
                  isOpen={true}
                  setIsOpen={async () => {
                    setShouldReauthenticate(false);

                    // After the user Disables MFA, Firebase will revoke the
                    // session cookie permissions. Therefore, we need to
                    // refresh the page only after reauthenticating
                    await refreshPage(true);
                  }}
                />
              </If>
            </SettingsTile>
          </If>
        </div>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

export default ProfileAuthenticationPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function MultiFactorSuccessAlert() {
  return (
    <Alert type={'success'} className={'flex flex-col space-y-2'}>
      <Alert.Heading>
        <Trans i18nKey={'profile:mfaEnabledSuccessTitle'} />
      </Alert.Heading>

      <p>
        <Trans i18nKey={'profile:mfaEnabledSuccessDescription'} />
      </p>
    </Alert>
  );
}
