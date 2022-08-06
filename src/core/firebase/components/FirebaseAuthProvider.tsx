import React, { Dispatch, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth, useFirebaseApp } from 'reactfire';
import { destroyCookie, parseCookies } from 'nookies';

import {
  initializeAuth,
  indexedDBLocalPersistence,
  connectAuthEmulator,
  inMemoryPersistence,
  User,
} from 'firebase/auth';

import { isBrowser } from '~/core/generic/is-browser';
import { useDestroySession } from '~/core/hooks/use-destroy-session';
import { UserSession } from '~/core/session/types/user-session';

const SESSION_EXPIRES_AT_COOKIE_NAME = `sessionExpiresAt`;

export const FirebaseAuthStateListener: React.FCC<{
  onAuthStateChange: (user: User | null) => void;
}> = ({ children, onAuthStateChange }) => {
  const auth = useAuth();

  // {@link onIdTokenChanged} will call the
  // callback when the user ID token changes
  // for example, when the user signs out
  // we update user context when ID token changes
  useEffect(() => {
    const subscription = auth.onIdTokenChanged(onAuthStateChange);

    return () => subscription();
  }, [auth, onAuthStateChange]);

  return <>{children}</>;
};

export default function FirebaseAuthProvider({
  userSession,
  setUserSession,
  children,
  useEmulator,
}: React.PropsWithChildren<{
  useEmulator: boolean;
  userSession: Maybe<UserSession>;
  setUserSession: Dispatch<Maybe<UserSession>>;
}>) {
  const app = useFirebaseApp();
  const signOut = useDestroySession();

  // make sure we're not using IndexedDB when SSR
  // as it is only supported on browser environments
  const persistence = isBrowser()
    ? indexedDBLocalPersistence
    : inMemoryPersistence;

  const sdk = initializeAuth(app, { persistence });
  const shouldConnectEmulator = useEmulator && !('emulator' in sdk.config);

  if (shouldConnectEmulator) {
    const host = getAuthEmulatorHost();

    connectAuthEmulator(sdk, host);
  }

  const onAuthStateChanged = useCallback(
    async (user: User | null) => {
      // We check two thing:
      // - 1. the user is signed in
      // - 2. the server-side session hasn't expired: if yes, unset cookie

      if (user && !isSessionExpired()) {
        const session = {
          auth: user,
          data: userSession?.data,
        };

        setUserSession(session);
      } else {
        // if the user was originally signed-in
        // we need to clear the session cookie
        if (userSession?.auth) {
          try {
            // when the SDK intercept a sign-out event
            // we also delete the session cookie used for SSR
            await signOut();

            destroyCookie(null, SESSION_EXPIRES_AT_COOKIE_NAME);
            setUserSession(undefined);
          } catch {
            setUserSession(undefined);
          }
        }
      }
    },
    [setUserSession, signOut, userSession?.auth, userSession?.data]
  );

  return (
    <AuthProvider sdk={sdk}>
      <FirebaseAuthStateListener onAuthStateChange={onAuthStateChanged}>
        {children}
      </FirebaseAuthStateListener>
    </AuthProvider>
  );
}

function getAuthEmulatorHost() {
  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
  const port = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;

  return ['http://', host, ':', port].join('');
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
