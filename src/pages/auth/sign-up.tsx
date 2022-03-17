import { useCallback } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Trans } from 'react-i18next';

import configuration from '~/configuration';

import { withAuthProps } from '~/lib/props/with-auth-props';
import OAuthProviders from '~/components/OAuthProviders';
import EmailPasswordSignUpForm from '~/components/EmailPasswordSignUpForm';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Logo from '~/core/ui/Logo';
import Button from '~/core/ui/Button';

const SignUp: React.FC = () => {
  const router = useRouter();
  const signInPath = configuration.paths.signIn;

  const onSignUp = useCallback(() => {
    return router.push(configuration.paths.onboarding);
  }, [router]);

  return (
    <>
      <Layout>
        <Head>
          <title>Sign Up</title>
        </Head>

        <div
          className={'flex items-center justify-center h-screen mt-2 md:mt-12'}
        >
          <div
            className={
              'items-center flex flex-col space-y-8 w-11/12 md:w-8/12 xl:w-3/12'
            }
          >
            <div className={'mb-2 sm:mb-4 lg:mb-8'}>
              <Logo className={'w-[85px]'} />
            </div>

            <Hero>
              <Trans i18nKey={'auth:signUp'} />
            </Hero>

            <OAuthProviders onSuccess={onSignUp} />

            <div className={'text-xs text-gray-400'}>
              <Trans i18nKey={'auth:orContinueWithEmail'} />
            </div>

            <EmailPasswordSignUpForm onSignUp={onSignUp} />

            <div>
              <Button
                type={'button'}
                href={signInPath}
                block
                size={'small'}
                color={'transparent'}
                className={'text-sm'}
              >
                <Trans i18nKey={'auth:alreadyHaveAnAccount'} />
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SignUp;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}
