import { useCallback, useEffect, useRef } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Trans } from 'next-i18next';
import { SpringSpinner } from 'react-epic-spinners';

import { FirebaseError } from 'firebase/app';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useAuth } from 'reactfire';

import { withAuthProps } from '~/lib/props/with-auth-props';
import Logo from '~/core/ui/Logo';
import Layout from '~/core/ui/Layout';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import { isBrowser } from '~/core/generic';
import { useRequestState } from '~/core/hooks/use-request-state';
import { useCreateSession } from '~/core/hooks/use-create-session';
import { useCsrfToken } from '~/core/firebase/hooks/use-csrf-token';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';

import configuration from '~/configuration';

// this is the key we use for storing the email locally
// so we can verify it is the same
const EMAIL_LOCAL_STORAGE_KEY = 'emailForSignIn';

const { onboarding, appHome } = configuration.paths;

const EmailLinkAuthPage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const requestExecutedRef = useRef<boolean>();

  const { state, setError } = useRequestState<void>();
  const [sessionRequest, sessionRequestState] = useCreateSession();
  const createCsrfToken = useCsrfToken();

  const loading = sessionRequestState.loading || sessionRequestState.loading;

  const redirectToAppHome = useCallback(() => {
    return router.push(appHome);
  }, [router]);

  // preload routes that may be used to redirect the user next
  useEffect(() => {
    void router.push(onboarding);
    void router.push(appHome);
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

        // we can create the session and store a cookie to make SSR work
        // additionally, we also pass a CSRF token
        const csrfToken = createCsrfToken();
        const idToken = await credential.user.getIdToken();
        await sessionRequest({ idToken, csrfToken });

        // let's clear the email from the storage
        clearEmailFromStorage();

        // redirect user to the home page
        await redirectToAppHome();
      } catch (e) {
        if (e instanceof FirebaseError) {
          setError(e.code);
        } else {
          setError('generic');
        }
      }
    })();
  }, [
    auth,
    createCsrfToken,
    loading,
    redirectToAppHome,
    sessionRequest,
    setError,
  ]);

  return (
    <Layout>
      <Head>
        <title key={'title'}>Email Link Authentication</title>
      </Head>

      <div className={'flex h-screen flex-col items-center justify-center'}>
        <div
          className={
            'flex w-11/12 flex-col items-center space-y-8 md:w-8/12' +
            ' lg:w-4/12 xl:w-3/12'
          }
        >
          <div className={'mb-2'}>
            <Logo />
          </div>

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
        </div>
      </div>
    </Layout>
  );
};

function LoadingState() {
  return (
    <div className={'flex space-x-2'}>
      <SpringSpinner size={32} color={'currentColor'} />

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
