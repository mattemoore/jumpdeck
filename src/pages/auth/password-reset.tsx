import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import { FormEvent } from 'react';
import { Trans } from 'react-i18next';

import { useAuth } from 'reactfire';
import { sendPasswordResetEmail } from 'firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import configuration from '~/configuration';

import { withAuthProps } from '~/lib/props/with-auth-props';
import AuthErrorMessage from '~/components/AuthErrorMessage';

import Layout from '~/core/ui/Layout';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import Logo from '~/core/ui/Logo';
import Hero from '~/core/ui/Hero';

export const PasswordReset: React.FC = () => {
  const auth = useAuth();
  const { state, setError, setData, setLoading } = useRequestState();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;

    setLoading(true);

    try {
      const returnUrl = getReturnUrl();

      await sendPasswordResetEmail(auth, email, {
        url: returnUrl,
      });

      setData(true);
    } catch (e) {
      setError(getFirebaseErrorCode(e));
    }
  };

  return (
    <Layout>
      <Head>
        <title>Password Reset</title>
      </Head>

      <div className={'flex items-center justify-center h-screen'}>
        <div
          className={
            'items-center flex flex-col space-y-8 w-11/12 md:w-8/12 lg:w-4/12 xl:w-3/12'
          }
        >
          <div className={'mb-2 sm:mb-4 lg:mb-8'}>
            <Logo className={'w-[85px]'} />
          </div>

          <div className={'text-center'}>
            <Hero>
              <Trans i18nKey={'auth:passwordResetLabel'} />
            </Hero>
          </div>

          <If condition={state.success}>
            <Alert type={'success'}>
              <Trans i18nKey={'auth:passwordResetSuccessMessage'} />
            </Alert>
          </If>

          <If condition={!state.data}>
            <>
              <form
                onSubmit={onSubmit}
                className={'container mx-auto flex justify-center'}
              >
                <div className={'flex-col space-y-6'}>
                  <div>
                    <p className={'text-sm text-gray-700 dark:text-gray-400'}>
                      <Trans i18nKey={'auth:passwordResetSubheading'} />
                    </p>
                  </div>

                  <div>
                    <TextField.Label>
                      <Trans i18nKey={'common:emailAddress'} />

                      <TextField.Input
                        name="email"
                        required
                        type="email"
                        placeholder={'your@email.com'}
                      />
                    </TextField.Label>
                  </div>

                  <If condition={state.error}>
                    <AuthErrorMessage error={state.error as string} />
                  </If>

                  <Button loading={state.loading} type="submit" block>
                    <Trans i18nKey={'auth:passwordResetLabel'} />
                  </Button>
                </div>
              </form>
            </>
          </If>

          <Button
            type={'button'}
            block
            size={'small'}
            color={'transparent'}
            className={'text-sm'}
          >
            <Link href={configuration.paths.signIn} passHref>
              <a>
                <Trans i18nKey={'auth:passwordResetSignInLink'} />
              </a>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordReset;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}

/**
 * @description
 * Return the URL where the user will be redirected to after resetting
 * their password. By default, we will redirect to the sign-in page
 */
function getReturnUrl() {
  return `${window.location.origin}${configuration.paths.signIn}`;
}
