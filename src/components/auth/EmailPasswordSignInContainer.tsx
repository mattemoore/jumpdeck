import { useCallback, useState } from 'react';

import {
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  MultiFactorError,
  Auth,
  EmailAuthProvider,
} from 'firebase/auth';

import { useAuth } from 'reactfire';

import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';

import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useRequestState } from '~/core/hooks/use-request-state';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';

import If from '~/core/ui/If';

const EmailPasswordSignInContainer: React.FCC<{
  onSignIn: () => unknown;
}> = ({ onSignIn }) => {
  const auth = useAuth();

  const [sessionRequest, sessionState] = useCreateServerSideSession();
  const requestState = useRequestState<void>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const isLoading = sessionState.loading || requestState.state.loading;

  const signInWithCredentials = useCallback(
    async (params: { email: string; password: string }) => {
      if (isLoading) {
        return;
      }

      requestState.setLoading(true);

      try {
        const credential = await getCredential(auth, params);

        if (credential) {
          // using the ID token, we will make a request to initiate the session
          // to make SSR possible via session cookie
          await sessionRequest(credential.user);

          // we notify the parent component that
          // the user signed in successfully, so they can be redirected
          onSignIn();
        }
      } catch (error) {
        if (isMultiFactorError(error)) {
          setMultiFactorAuthError(error);
        } else {
          requestState.setError(error);
        }
      }
    },
    [isLoading, auth, sessionRequest, onSignIn, requestState]
  );

  return (
    <>
      <If condition={requestState.state.error}>
        <AuthErrorMessage
          error={getFirebaseErrorCode(requestState.state.error)}
        />
      </If>

      <EmailPasswordSignInForm
        onSubmit={signInWithCredentials}
        loading={isLoading}
      />

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async (credential) => {
              await sessionRequest(credential.user);

              // we notify the parent component that
              // the user signed in successfully, so they can be redirected
              onSignIn();
            }}
          />
        )}
      </If>
    </>
  );
};

async function getCredential(
  auth: Auth,
  params: { email: string; password: string }
) {
  const { email, password } = params;
  const user = auth.currentUser;

  if (user) {
    const credential = EmailAuthProvider.credential(email, password);

    return reauthenticateWithCredential(user, credential);
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export default EmailPasswordSignInContainer;
