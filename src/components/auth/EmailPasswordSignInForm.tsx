import { useCallback, useRef } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import { Trans } from 'next-i18next';
import { useForm } from 'react-hook-form';

import AuthErrorMessage from './AuthErrorMessage';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import { useSignInWithEmailAndPassword } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

const EmailPasswordSignInForm: React.FCC<{
  onSignIn: () => unknown;
}> = ({ onSignIn }) => {
  const createCsrfToken = useCsrfToken();
  const [sessionRequest, sessionState] = useCreateSession();
  const [signIn, status] = useSignInWithEmailAndPassword();
  const redirecting = useRef(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailControl = register('email', { required: true });
  const passwordControl = register('password', { required: true });

  const isLoading =
    sessionState.loading || status.loading || redirecting.current;

  const createSession = useCallback(
    async (user: User) => {
      const idToken = await user.getIdToken();
      const csrfToken = createCsrfToken();

      return sessionRequest({ idToken, csrfToken });
    },
    [createCsrfToken, sessionRequest]
  );

  const signInWithCredentials = useCallback(
    async (params: { email: string; password: string }) => {
      if (status.loading) {
        return;
      }

      const credential = await signIn(params.email, params.password);

      if (credential) {
        // using the ID token, we will make a request to initiate the session
        // to make SSR possible via session cookie
        await createSession(credential.user);

        redirecting.current = true;

        // we notify the parent component that
        // the user signed in successfully, so they can be redirected
        onSignIn();
      }
    },
    [signIn, status.loading, createSession, onSignIn]
  );

  return (
    <form className={'w-full'} onSubmit={handleSubmit(signInWithCredentials)}>
      <div className={'flex-col space-y-2.5'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'common:emailAddress'} />

            <TextField.Input
              data-cy={'email-input'}
              required
              type="email"
              placeholder={'your@email.com'}
              innerRef={emailControl.ref}
              onBlur={emailControl.onBlur}
              onChange={emailControl.onChange}
              name={emailControl.name}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'common:password'} />

            <TextField.Input
              required
              data-cy={'password-input'}
              type="password"
              placeholder={''}
              innerRef={passwordControl.ref}
              onBlur={passwordControl.onBlur}
              onChange={passwordControl.onChange}
              name={passwordControl.name}
            />

            <div className={'py-0.5 text-xs'}>
              <Link href={'/auth/password-reset'} passHref>
                <a className={'hover:underline'}>
                  <Trans i18nKey={'auth:passwordForgottenQuestion'} />
                </a>
              </Link>
            </div>
          </TextField.Label>
        </TextField>

        <If condition={status.error}>
          {(error) => {
            return <AuthErrorMessage error={getFirebaseErrorCode(error)} />;
          }}
        </If>

        <div>
          <Button
            className={'w-full'}
            size={'large'}
            color={'primary'}
            data-cy="auth-submit-button"
            type="submit"
            loading={isLoading}
          >
            <If
              condition={isLoading}
              fallback={<Trans i18nKey={'auth:signIn'} />}
            >
              <Trans i18nKey={'auth:signingIn'} />
            </If>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmailPasswordSignInForm;
