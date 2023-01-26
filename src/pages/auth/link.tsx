import { useCallback, useEffect, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from 'reactfire';

import { Trans } from 'next-i18next';

import {
  isSignInWithEmailLink,
  MultiFactorError,
  signInWithEmailLink,
  User,
} from 'firebase/auth';

import { withAuthProps } from '~/lib/props/with-auth-props';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import { isBrowser } from '~/core/generic/is-browser';
import { useRequestState } from '~/core/hooks/use-request-state';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';
import AuthPageLayout from '~/components/auth/AuthPageLayout';

import configuration from '~/configuration';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import Spinner from '~/core/ui/Spinner';

// this is the key we use for storing the email locally
// so we can verify it is the same
const EMAIL_LOCAL_STORAGE_KEY = 'emailForSignIn';

const { onboarding, appHome } = configuration.paths;

const EmailLinkAuthPage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const requestExecutedRef = useRef<boolean>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const { state, setError } = useRequestState<void>();
  const [sessionRequest, sessionRequestState] = useCreateServerSideSession();

  const loading = sessionRequestState.loading || sessionRequestState.loading;

  const redirectToAppHome = useCallback(() => {
    return router.push(appHome);
  }, [router]);

  const onSignInSuccess = useCallback(
    async (user: User) => {
      // we can create the session and store a cookie to make SSR work
      await sessionRequest(user);

      // let's clear the email from the storage
      clearEmailFromStorage();

      // redirect user to the home page
      await redirectToAppHome();
    },
    [redirectToAppHome, sessionRequest]
  );

  // preload routes that may be used to redirect the user next
  useEffect(() => {
    void router.prefetch(onboarding);
    void router.prefetch(appHome);
  }, [router]);

  // in this effect, we execute the functions to log the user in
  useEffect(() => {
    // let's prevent duplicate calls (which should only happen in dev mode)
    if (requestExecutedRef.current) {
      return;
    }

    const href = getOriginHref();

    // do not run on the server
    if (!href) {
      return;
    }

    // let's get email used to get the link
    if (!isSignInWithEmailLink(auth, href)) {
      setError('generic');

      return;
    }

    const email = getStorageEmail();

    // let's verify the stored email is the same
    if (!email) {
      setError('generic');

      return;
    }

    void (async () => {
      requestExecutedRef.current = true;

      try {
        // sign in with link, and retrieve the ID Token
        const credential = await signInWithEmailLink(auth, email, href);

        return onSignInSuccess(credential.user);
      } catch (error) {
        if (isMultiFactorError(error)) {
          setMultiFactorAuthError(error);
        } else {
          setError(getFirebaseErrorCode(error));
        }
      }
    })();
  }, [
    auth,
    loading,
    onSignInSuccess,
    redirectToAppHome,
    sessionRequest,
    setError,
  ]);

  return (
    <AuthPageLayout heading={``}>
      <If condition={loading}>
        <LoadingState />
      </If>

      <If condition={state.error}>
        <div className={'flex flex-col space-y-2'}>
          <AuthErrorMessage error={state.error as string} />

          <Button color={'transparent'} href={configuration.paths.signIn}>
            <Trans i18nKey={'auth:getNewLink'} />
          </Button>
        </div>
      </If>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            cancelButton={false}
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={(credential) => {
              return onSignInSuccess(credential.user);
            }}
          />
        )}
      </If>
    </AuthPageLayout>
  );
};

function LoadingState() {
  return (
    <div className={'flex space-x-2'}>
      <Spinner />

      <span>
        <Trans i18nKey={'auth:signingIn'} />
      </span>
    </div>
  );
}

function getStorageEmail() {
  if (!isBrowser()) {
    return;
  }

  return window.localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY);
}

function clearEmailFromStorage() {
  window.localStorage.removeItem(EMAIL_LOCAL_STORAGE_KEY);
}

function getOriginHref() {
  if (!isBrowser()) {
    return;
  }

  return window.location.href;
}

export default EmailLinkAuthPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAuthProps(ctx);
}
