import { useCallback, useEffect, useRef } from 'react';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';

import If from '~/core/ui/If';
import { useSignUpWithEmailAndPassword } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import AuthErrorMessage from './AuthErrorMessage';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import EmailPasswordSignUpForm from '~/components/auth/EmailPasswordSignUpForm';

const EmailPasswordSignUpContainer: React.FCC<{
  onSignUp: () => unknown;
  onError?: (error: FirebaseError) => unknown;
}> = ({ onSignUp, onError }) => {
  const [sessionRequest, sessionState] = useCreateServerSideSession();
  const [signUp, state] = useSignUpWithEmailAndPassword();
  const redirecting = useRef(false);

  const loading = state.loading || sessionState.loading || redirecting.current;

  const callOnErrorCallback = useCallback(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  const createSession = useCallback(
    async (user: User) => {
      // using the ID token, we will make a request to initiate the session
      // to make SSR possible via session cookie
      await sessionRequest(user);

      redirecting.current = true;

      // we notify the parent component that
      // the user signed up successfully, so they can be redirected
      onSignUp();
    },
    [onSignUp, sessionRequest]
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
    <>
      <If condition={state.error}>
        {(error) => <AuthErrorMessage error={getFirebaseErrorCode(error)} />}
      </If>

      <EmailPasswordSignUpForm onSubmit={onSubmit} loading={loading} />
    </>
  );
};

export default EmailPasswordSignUpContainer;
