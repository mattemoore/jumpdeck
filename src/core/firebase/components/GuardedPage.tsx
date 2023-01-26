import { useCallback, useEffect } from 'react';
import { useAuth, useSigninCheck } from 'reactfire';
import { parseCookies, destroyCookie } from 'nookies';

import { isBrowser } from '~/core/generic/is-browser';
import useClearFirestoreCache from '~/core/hooks/use-clear-firestore-cache';
import { useDestroySession } from '~/core/hooks/use-destroy-session';

const AuthRedirectListener: React.FCC<{
  whenSignedOut?: string;
}> = ({ children, whenSignedOut }) => {
  const auth = useAuth();
  const { status } = useSigninCheck({ suspense: true });
  const { trigger: destroySession } = useDestroySession();
  const redirectUserAway = useRedirectUserAway();
  const clearCache = useClearFirestoreCache();
  const isSignInCheckDone = status === 'success';

  useEffect(() => {
    if (!isSignInCheckDone) {
      return;
    }

    // if the session is expired, we sign the user out
    // the user will be redirected away in the next effect (because "user"
    // will become null)
    if (isSessionExpired()) {
      clearAuthCookies();
      clearCache();

      void auth.signOut();
    }
  }, [auth, clearCache, isSignInCheckDone]);

  useEffect(() => {
    // this should run once and only on success
    if (!isSignInCheckDone) {
      return;
    }

    // keep this running for the whole session
    // unless the component was unmounted, for example, on log-outs
    const listener = auth.onAuthStateChanged(async (user) => {
      // log user out if user is falsy
      // and if the consumer provided a route to redirect the user
      const shouldLogOut = !user && whenSignedOut;

      if (!user) {
        clearCache();
      }

      if (shouldLogOut) {
        await destroySession();

        return redirectUserAway(whenSignedOut);
      }
    });

    // destroy listener on un-mounts
    return () => listener();
  }, [
    auth,
    clearCache,
    destroySession,
    isSignInCheckDone,
    redirectUserAway,
    status,
    whenSignedOut,
  ]);

  return <>{children}</>;
};

export default function GuardedPage({
  children,
  whenSignedOut,
}: React.PropsWithChildren<{
  whenSignedOut?: string;
}>) {
  const shouldActivateListener = isBrowser();

  // we only activate the listener if
  // we are rendering in the browser
  if (!shouldActivateListener) {
    return <>{children}</>;
  }

  return (
    <AuthRedirectListener whenSignedOut={whenSignedOut}>
      {children}
    </AuthRedirectListener>
  );
}

function isSessionExpired() {
  const expiresAt = getExpiresAtCookie();
  const date = new Date();
  const now = new Date(date.toISOString()).getTime();

  return !expiresAt || now > expiresAt;
}

function getExpiresAtCookie() {
  const cookies = parseCookies();
  const value = cookies[`sessionExpiresAt`];

  if (!Number.isNaN(Number(value))) {
    return Number(value);
  }
}

function useRedirectUserAway() {
  return useCallback((path: string) => {
    const currentPath = window.location.pathname;
    const isNotCurrentPage = currentPath !== path;

    // we then redirect the user to the page
    // specified in the props of the component
    if (isNotCurrentPage) {
      clearAuthCookies();

      window.location.assign(path);
    }
  }, []);
}

function clearAuthCookies() {
  destroyCookie(null, 'sessionExpiresAt');
}
