import React, { useCallback, useEffect } from 'react';
import { AuthProvider, useAuth, useFirebaseApp } from 'reactfire';

import {
  initializeAuth,
  indexedDBLocalPersistence,
  connectAuthEmulator,
  inMemoryPersistence,
  User,
} from 'firebase/auth';

import { isBrowser } from '~/core/generic/is-browser';
import { UserSession } from '~/lib/organizations/types/user-session';
import { UserData } from '~/lib/organizations/types/user-data';
import { useDestroySession } from '~/core/hooks/use-destroy-session';
import { clearFirestoreCache } from '~/core/generic/clear-firestore-cache';

export const FirebaseAuthStateListener: React.FC<{
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
  setUserSession: (userSession: Maybe<UserSession>) => void;
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
      if (user) {
        const session = {
          auth: user,
          data: userSession?.data as UserData,
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

type MyType<T = unknown> = T extends { c: number }
  ? { a: number }
  : { b: number };

const t: MyType<{ c: number }> = {
  a: 3,
};
