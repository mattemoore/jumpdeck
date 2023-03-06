import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { useCallback, useEffect } from 'react';
import { useAuth } from 'reactfire';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import If from '~/core/ui/If';

import configuration from '~/configuration';
import { isBrowser } from '~/core/generic/is-browser';
import getClientQueryParams from '~/core/generic/get-client-query-params';
import { getRedirectPathWithoutSearchParam } from '~/core/generic/get-redirect-url';

import { withAuthProps } from '~/lib/props/with-auth-props';
import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailPasswordSignInContainer from '~/components/auth/EmailPasswordSignInContainer';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';
import AuthPageLayout from '~/components/auth/AuthPageLayout';

const signUpPath = configuration.paths.signUp;
const appHome = configuration.paths.appHome;

const FORCE_SIGN_OUT_QUERY_PARAM = 'signOut';
const NEEDS_EMAIL_VERIFICATION_QUERY_PARAM = 'needsEmailVerification';

export const SignIn: React.FCC = () => {
  const router = useRouter();
  const auth = useAuth();
  const { t } = useTranslation();

  const shouldForceSignOut = useShouldSignOut();
  const shouldVerifyEmail = useShouldVerifyEmail();

  const onSignIn = useCallback(async () => {
    const path = getRedirectPathWithoutSearchParam(appHome);

    return router.push(path);
  }, [router]);

  // let's prefetch the application home
  // to avoid slow redirects
  useEffect(() => {
    void router.prefetch(appHome);
  }, [router]);

  // force user signOut if the query parameter has been passed
  useEffect(() => {
    if (shouldForceSignOut) {
      void auth.signOut();
    }
  }, [auth, shouldForceSignOut]);

  return (
    <AuthPageLayout heading={<Trans i18nKey={'auth:signInHeading'} />}>
      <Head>
        <title key={'title'}>{t(`auth:signIn`)}</title>
      </Head>

      <OAuthProviders onSignIn={onSignIn} />

      <If condition={configuration.auth.providers.emailPassword}>
        <span className={'text-xs text-gray-400'}>
          <Trans i18nKey={'auth:orContinueWithEmail'} />
        </span>

        <EmailPasswordSignInContainer
          shouldVerifyEmail={shouldVerifyEmail}
          onSignIn={onSignIn}
        />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSignIn={onSignIn} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:doNotHaveAccountYet'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            href={signUpPath}
          >
            <Trans i18nKey={'auth:signUp'} />
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default SignIn;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}

function useShouldSignOut() {
  return useQueryParam(FORCE_SIGN_OUT_QUERY_PARAM) === 'true';
}

function useShouldVerifyEmail() {
  return useQueryParam(NEEDS_EMAIL_VERIFICATION_QUERY_PARAM) === 'true';
}

function useQueryParam(param: string) {
  if (!isBrowser()) {
    return null;
  }

  const params = getClientQueryParams();

  return params.get(param);
}
