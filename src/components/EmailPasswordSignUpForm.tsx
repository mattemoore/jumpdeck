import { FormEvent, useCallback, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { Trans } from 'next-i18next';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import { useSignUpWithEmailAndPassword } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

import AuthErrorMessage from './AuthErrorMessage';

const EmailPasswordSignUpForm: React.FC<{
  onSignUp: () => void;
  onError?: (error: FirebaseError) => void;
}> = ({ onSignUp, onError }) => {
  const createCsrfToken = useCsrfToken();
  const [sessionRequest, sessionState] = useCreateSession();
  const [signUp, state] = useSignUpWithEmailAndPassword();

  const loading = state.loading || sessionState.loading;
  const user = state.data?.user;

  const callOnErrorCallback = useCallback(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  useEffect(() => {
    async function createSession() {
      if (!user) {
        return;
      }

      const idToken = await user.getIdToken();
      const csrfToken = createCsrfToken();

      // using the ID token, we will make a request to initiate the session
      // to make SSR possible via session cookie
      await sessionRequest({
        idToken,
        csrfToken,
      });

      // we notify the parent component that
      // the user signed up successfully, so they can be redirected
      onSignUp();
    }

    void createSession();
  }, [createCsrfToken, onSignUp, sessionRequest, user]);

  useEffect(() => {
    callOnErrorCallback();
  }, [callOnErrorCallback]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      const data = new FormData(event.currentTarget);
      const email = data.get(`email`) as string;
      const password = data.get(`password`) as string;

      // sign up with Firebase Auth
      await signUp(email, password);
    },
    [loading, signUp]
  );

  return (
    <form className={'w-full'} onSubmit={onSubmit}>
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
              data-cy={'password-input'}
              required
              name="password"
              type="password"
              placeholder={''}
            />
          </TextField.Label>
        </TextField>

        <If condition={state.error}>
          {(error) => <AuthErrorMessage error={getFirebaseErrorCode(error)} />}
        </If>

        <div>
          <Button
            data-cy={'auth-submit-button'}
            type="submit"
            block
            loading={loading}
          >
            <Trans i18nKey={'auth:signUp'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmailPasswordSignUpForm;
