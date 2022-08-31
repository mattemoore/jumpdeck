import { useCallback, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';

import { Trans } from 'next-i18next';
import { useForm } from 'react-hook-form';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import { useSignUpWithEmailAndPassword } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';

import AuthErrorMessage from './AuthErrorMessage';

const EmailPasswordSignUpForm: React.FCC<{
  onSignUp: () => unknown;
  onError?: (error: FirebaseError) => unknown;
}> = ({ onSignUp, onError }) => {
  const createCsrfToken = useCsrfToken();
  const [sessionRequest, sessionState] = useCreateSession();
  const [signUp, state] = useSignUpWithEmailAndPassword();

  const loading = state.loading || sessionState.loading;

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailControl = register('email', { required: true });
  const passwordControl = register('password', { required: true });

  const callOnErrorCallback = useCallback(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  const createSession = useCallback(
    async (user: User) => {
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
    },
    [onSignUp, sessionRequest, createCsrfToken]
  );

  useEffect(() => {
    callOnErrorCallback();
  }, [callOnErrorCallback]);

  const onSubmit = useCallback(
    async (params: { email: string; password: string }) => {
      if (loading) {
        return;
      }

      const credential = await signUp(params.email, params.password);

      if (credential) {
        await createSession(credential.user);
      }
    },
    [loading, signUp, createSession]
  );

  return (
    <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex-col space-y-4'}>
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
              data-cy={'password-input'}
              required
              type="password"
              placeholder={''}
              innerRef={passwordControl.ref}
              onBlur={passwordControl.onBlur}
              onChange={passwordControl.onChange}
              name={passwordControl.name}
            />
          </TextField.Label>
        </TextField>

        <If condition={state.error}>
          {(error) => <AuthErrorMessage error={getFirebaseErrorCode(error)} />}
        </If>

        <div>
          <Button
            size={'large'}
            data-cy={'auth-submit-button'}
            className={'w-full'}
            color={'primary'}
            type="submit"
            loading={loading}
          >
            <If
              condition={loading}
              fallback={<Trans i18nKey={'auth:signUp'} />}
            >
              <span>Signing you up...</span>
            </If>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmailPasswordSignUpForm;
