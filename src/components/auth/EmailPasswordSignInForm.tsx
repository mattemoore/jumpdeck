import { FormEvent, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import { Trans } from 'next-i18next';

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

  const isLoading = sessionState.loading || status.loading;

  const signInWithCredentials = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (status.loading) {
        return;
      }

      const data = new FormData(event.currentTarget);
      const email = data.get(`email`) as string;
      const password = data.get(`password`) as string;

      return signIn(email, password);
    },
    [signIn, status.loading]
  );

  useEffect(() => {
    if (!status.data) {
      return;
    }

    async function createSession(user: User) {
      const idToken = await user.getIdToken();
      const csrfToken = createCsrfToken();

      return sessionRequest({ idToken, csrfToken });
    }

    void (async () => {
      // using the ID token, we will make a request to initiate the session
      // to make SSR possible via session cookie
      await createSession(status.data.user);

      // we notify the parent component that
      // the user signed in successfully, so they can be redirected
      onSignIn();
    })();
  }, [createCsrfToken, onSignIn, sessionRequest, status.data]);

  return (
    <form className={'w-full'} onSubmit={signInWithCredentials}>
      <div className={'flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'common:emailAddress'} />

            <TextField.Input
              data-cy={'email-input'}
              name="email"
              required
              type="email"
              placeholder={'your@email.com'}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'common:password'} />

            <TextField.Input
              required
              data-cy={'password-input'}
              name="password"
              type="password"
              placeholder={''}
            />

            <TextField.Hint>
              <Link href={'/auth/password-reset'} passHref>
                <a>
                  <Trans i18nKey={'auth:passwordForgottenQuestion'} />
                </a>
              </Link>
            </TextField.Hint>
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
            color={'primary'}
            data-cy="auth-submit-button"
            type="submit"
            loading={isLoading}
          >
            <Trans i18nKey={'auth:signIn'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmailPasswordSignInForm;
