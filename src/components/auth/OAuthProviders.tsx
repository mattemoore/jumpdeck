import { PropsWithChildren, useCallback, useState } from 'react';
import { Trans } from 'next-i18next';

import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  MultiFactorError,
  UserCredential,
  User,
} from 'firebase/auth';

import AuthProviderButton from '~/core/ui/AuthProviderButton';
import { useSignInWithProvider } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import If from '~/core/ui/If';

import AuthErrorMessage from './AuthErrorMessage';
import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';

import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

const OAuthProviders: React.FCC<{
  onSuccess: () => unknown;
}> = ({ onSuccess }) => {
  const [signInWithProvider, signInState] = useSignInWithProvider();
  const [sessionRequest, sessionRequestState] = useCreateServerSideSession();

  // we make the UI "busy" until the next page is fully loaded
  const loading =
    signInState.success ||
    signInState.loading ||
    sessionRequestState.loading ||
    sessionRequestState.success;

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const createSession = useCallback(
    async (user: User) => {
      await sessionRequest(user);

      onSuccess();
    },
    [sessionRequest, onSuccess]
  );

  const onSignInWithProvider = useCallback(
    async (signInRequest: () => Promise<UserCredential | undefined>) => {
      try {
        const credential = await signInRequest();

        if (!credential) {
          return;
        }

        await createSession(credential.user);
      } catch (error) {
        if (isMultiFactorError(error)) {
          setMultiFactorAuthError(error as MultiFactorError);
        }
      }
    },
    [setMultiFactorAuthError, createSession]
  );

  return (
    <>
      <If condition={loading}>
        <PageLoadingIndicator />
      </If>

      <div className={'flex w-full flex-1 flex-col space-y-3'}>
        <div className={'flex-col space-y-2'}>
          <SignInWithGoogleButton
            onSignIn={() =>
              onSignInWithProvider(() =>
                signInWithProvider(new GoogleAuthProvider())
              )
            }
          />

          <SignInWithFacebookButton
            onSignIn={() =>
              onSignInWithProvider(() =>
                signInWithProvider(new FacebookAuthProvider())
              )
            }
          />
        </div>

        <If condition={signInState.error}>
          {(e) => {
            return <AuthErrorMessage error={getFirebaseErrorCode(e)} />;
          }}
        </If>

        <If condition={sessionRequestState.error}>
          <AuthErrorMessage error={sessionRequestState.error} />
        </If>
      </div>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async (credential) => {
              return createSession(credential.user);
            }}
          />
        )}
      </If>
    </>
  );
};

function SignInWithGoogleButton({
  onSignIn,
}: PropsWithChildren<{ onSignIn: () => Promise<unknown> }>) {
  return (
    <AuthProviderButton image={'/assets/images/google.png'} onClick={onSignIn}>
      <Trans
        i18nKey={'auth:signInWithProvider'}
        values={{ provider: 'Google' }}
      />
    </AuthProviderButton>
  );
}

function SignInWithFacebookButton({
  onSignIn,
}: PropsWithChildren<{ onSignIn: () => Promise<unknown> }>) {
  return (
    <AuthProviderButton image={'/assets/images/fb.png'} onClick={onSignIn}>
      <Trans
        i18nKey={'auth:signInWithProvider'}
        values={{ provider: 'Facebook' }}
      />
    </AuthProviderButton>
  );
}

export default OAuthProviders;
