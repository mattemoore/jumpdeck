import { PropsWithChildren, useEffect } from 'react';
import { Trans } from 'next-i18next';

import { GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

import { useCreateSession } from '~/core/hooks/use-create-session';
import AuthProviderButton from '~/core/ui/AuthProviderButton';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';
import { useSignInWithProvider } from '~/core/firebase/hooks';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import If from '~/core/ui/If';

import AuthErrorMessage from './AuthErrorMessage';

const OAuthProviders: React.FCC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const [signInWithProvider, signInState] = useSignInWithProvider();
  const [sessionRequest, sessionRequestState] = useCreateSession();
  const createCsrfToken = useCsrfToken();

  useEffect(() => {
    // only run when user signed in
    if (!signInState.success) {
      return;
    }

    // only run one request at a time
    if (
      sessionRequestState.loading ||
      sessionRequestState.error ||
      sessionRequestState.success
    ) {
      return;
    }

    void (async () => {
      const user = signInState.data?.user;
      const idToken = await user?.getIdToken();

      if (!idToken) {
        return;
      }

      const csrfToken = createCsrfToken();

      // we can create the session and store a cookie to make SSR work
      // additionally, we also pass a CSRF token
      await sessionRequest({ idToken, csrfToken });

      onSuccess();
    })();
  }, [
    onSuccess,
    sessionRequest,
    signInState,
    sessionRequestState,
    createCsrfToken,
  ]);

  return (
    <div className={'flex w-full flex-1 flex-col space-y-3'}>
      <div className={'flex-col space-y-4'}>
        <SignInWithGoogleButton
          onSignIn={() => signInWithProvider(new GoogleAuthProvider())}
        />

        <SignInWithFacebookButton
          onSignIn={() => signInWithProvider(new FacebookAuthProvider())}
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
