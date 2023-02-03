import { useCallback, useState } from 'react';
import { Trans } from 'next-i18next';

import {
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  MultiFactorError,
  Auth,
  EmailAuthProvider,
  sendEmailVerification,
  User,
} from 'firebase/auth';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth, useUser } from 'reactfire';

import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';

import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useRequestState } from '~/core/hooks/use-request-state';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import Button from '~/core/ui/Button';

import configuration from '~/configuration';

const EmailPasswordSignInContainer: React.FCC<{
  onSignIn: () => unknown;
}> = ({ onSignIn }) => {
  const auth = useAuth();

  const [sessionRequest, sessionState] = useCreateServerSideSession();
  const requestState = useRequestState<void>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const [showVerificationAlert, setShowVerificationAlert] =
    useState<boolean>(false);

  const isLoading = Boolean(
    sessionState.loading || requestState.state.loading || sessionState.success
  );

  const signInWithCredentials = useCallback(
    async (params: { email: string; password: string }) => {
      if (isLoading) {
        return;
      }

      requestState.setLoading(true);

      try {
        const credential = await getCredential(auth, params);
        const isEmailVerified = credential.user.emailVerified;

        const requiresEmailVerification =
          configuration.auth.requireEmailVerification;

        if (requiresEmailVerification && !isEmailVerified) {
          setShowVerificationAlert(true);

          return requestState.resetState();
        }

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

      <If condition={showVerificationAlert}>
        <VerifyEmailAlert />
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
            setIsOpen={(isOpen) => {
              setMultiFactorAuthError(undefined);

              // when the MFA modal gets closed without verification
              // we reset the state
              if (!isOpen) {
                requestState.resetState();
              }
            }}
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

function VerifyEmailAlert() {
  const { data: user } = useUser();
  const state = useRequestState();

  const onSendEmail = useCallback(
    async (user: User) => {
      try {
        state.setLoading(true);

        await sendEmailVerification(user, {
          url: window.location.href,
        });

        state.setData(null);
      } catch (error) {
        state.setError(error);
      }
    },
    [state]
  );

  return (
    <Alert type={'warn'}>
      <Alert.Heading>
        <Trans i18nKey={'auth:emailConfirmationAlertHeading'} />
      </Alert.Heading>

      <div className={'flex flex-col space-y-4'}>
        <p>
          <Trans i18nKey={'auth:emailConfirmationAlertBody'} />
        </p>

        <If condition={state.state.success}>
          <p className={'flex items-center space-x-2 text-sm'}>
            <CheckCircleIcon className={'h-4'} />

            <span>
              <Trans i18nKey={'auth:sendAgainEmailVerificationSuccess'} />
            </span>
          </p>
        </If>

        <If condition={user && !state.state.success}>
          <div>
            <Button
              loading={state.state.loading}
              className={'hover:color-yellow-900 border border-yellow-600'}
              color={'custom'}
              size={'small'}
              onClick={() => user && onSendEmail(user)}
            >
              <Trans i18nKey={'auth:sendAgainEmailVerificationLabel'} />
            </Button>
          </div>
        </If>
      </div>
    </Alert>
  );
}
