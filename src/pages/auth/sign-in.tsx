import { GetServerSidePropsContext } from 'next';
import { useCallback } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { Trans } from 'next-i18next';

import configuration from '~/configuration';
import { getRedirectPathWithoutSearchParam } from '~/core/generic/get-redirect-url';

import { withAuthProps } from '~/lib/props/with-auth-props';
import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Logo from '~/core/ui/Logo';
import Button from '~/core/ui/Button';

export const SignIn: React.FCC = () => {
  const router = useRouter();
  const signUpPath = configuration.paths.signUp;

  const onSignIn = useCallback(async () => {
    const appHome = configuration.paths.appHome;
    const path = getRedirectPathWithoutSearchParam(appHome);

    return router.push(path);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title key={'title'}>Sign In</title>
      </Head>

      <div className={'flex h-screen flex-col items-center justify-center'}>
        <div
          className={
            'flex w-11/12 flex-col items-center space-y-8 md:w-8/12 lg:w-4/12 xl:w-3/12'
          }
        >
          <div className={'mb-2 sm:mb-4 lg:mb-8'}>
            <Logo className={'w-[85px]'} />
          </div>

          <Hero>
            <Trans i18nKey={'auth:signIn'} />
          </Hero>

          <OAuthProviders onSuccess={onSignIn} />

          <div className={'text-xs text-gray-400'}>
            <Trans i18nKey={'auth:orContinueWithEmail'} />
          </div>

          <EmailPasswordSignInForm onSignIn={onSignIn} />

          <div>
            <Button
              type={'button'}
              href={signUpPath}
              block
              size={'small'}
              color={'transparent'}
              className={'text-sm'}
            >
              <Trans i18nKey={'auth:doNotHaveAccountYet'} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}
