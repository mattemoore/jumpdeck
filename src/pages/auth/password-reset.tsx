import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import { FormEvent, useCallback } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { useAuth } from 'reactfire';
import { sendPasswordResetEmail } from 'firebase/auth';

import { useRequestState } from '~/core/hooks/use-request-state';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import configuration from '~/configuration';

import { withAuthProps } from '~/lib/props/with-auth-props';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import AuthPageLayout from '~/components/auth/AuthPageLayout';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

export const PasswordReset: React.FCC = () => {
  const auth = useAuth();
  const { state, setError, setData, setLoading } = useRequestState();
  const { t } = useTranslation();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [auth, setData, setError, setLoading]
  );

  return (
    <AuthPageLayout heading={<Trans i18nKey={'auth:passwordResetLabel'} />}>
      <Head>
        <title key={'title'}>{t(`auth:passwordResetLabel`)}</title>
      </Head>

      <If condition={state.success}>
        <Alert type={'success'}>
          <Trans i18nKey={'auth:passwordResetSuccessMessage'} />
        </Alert>
      </If>

      <If condition={!state.data}>
        <>
          <form
            onSubmit={(e) => void onSubmit(e)}
            className={'container mx-auto flex justify-center'}
          >
            <div className={'flex-col space-y-4'}>
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

              <Button
                loading={state.loading}
                type="submit"
                block
              >
                <Trans i18nKey={'auth:passwordResetLabel'} />
              </Button>
            </div>
          </form>
        </>
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:passwordRecoveredQuestion'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            href={configuration.paths.signIn}
          >
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </p>
      </div>
    </AuthPageLayout>
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
