import { useCallback, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';

import configuration from '~/configuration';

import { withAuthProps } from '~/lib/props/with-auth-props';
import OAuthProviders from '~/components/auth/OAuthProviders';
import If from '~/core/ui/If';

import EmailPasswordSignUpContainer from '~/components/auth/EmailPasswordSignUpContainer';
import AuthPageLayout from '~/components/auth/AuthPageLayout';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';

const signInPath = configuration.paths.signIn;
const onboarding = configuration.paths.onboarding;

const SignUp: React.FCC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const onSignUp = useCallback(() => {
    return router.push(onboarding);
  }, [router]);

  // let's prefetch the onboarding route
  // to avoid slow redirects
  useEffect(() => {
    void router.prefetch(onboarding);
  }, [router]);

  return (
    <AuthPageLayout heading={<Trans i18nKey={'auth:signUpHeading'} />}>
      <Head>
        <title key={'title'}>{t(`auth:signUp`)}</title>
      </Head>

      <OAuthProviders onSignIn={onSignUp} />

      <If condition={configuration.auth.providers.emailPassword}>
        <div>
          <span className={'text-xs text-gray-400'}>
            <Trans i18nKey={'auth:orContinueWithEmail'} />
          </span>
        </div>

        <EmailPasswordSignUpContainer onSignUp={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSignIn={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:alreadyHaveAnAccount'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            href={signInPath}
          >
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default SignUp;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}
