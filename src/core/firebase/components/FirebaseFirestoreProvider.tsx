import { FirestoreProvider, useFirebaseApp } from 'reactfire';

import {
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
  Firestore,
  initializeFirestore,
} from 'firebase/firestore';

import { isBrowser } from '~/core/generic/is-browser';
import configuration from '~/configuration';

export default function FirebaseFirestoreProvider({
  children,
  useEmulator,
}: React.PropsWithChildren<{ useEmulator?: boolean }>) {
  const app = useFirebaseApp();
  const firestore = initializeFirestore(app, getFirestoreConfig());

  const isEmulatorEnv = configuration.emulator ?? useEmulator;

  // connect to emulator if enabled
  if (isEmulatorEnv) {
    const host = getFirestoreHost();
    const port = Number(getFirestorePort());

    try {
      executeSafely(() => {
        if (!didFirestoreInitialize(firestore)) {
          connectFirestoreEmulator(firestore, host, port);
        }
      });
    } catch (e) {
      // this may happen on re-renderings
    }
  }

  const enablePersistence =
    isBrowser() && !didFirestoreInitialize(firestore) && !isTestEnv();

  // We enable offline capabilities by caching Firestore in IndexedDB
  // NB: if you don't want to cache results, please remove the next few lines
  if (enablePersistence) {
    executeSafely(() => enableIndexedDbPersistence(firestore));
  }

  return <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>;
}

/**
 * @name executeSafely
 * @description wrap callback for exceptions which may happen due to re-renderings and HMR
 * @param callback
 */
function executeSafely(callback: () => Promise<unknown> | void) {
  try {
    void callback();
  } catch (e) {
    // the exception may be thrown on re-renderings
  }
}

function getFirestoreHost() {
  return process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? 'localhost';
}

function getFirestorePort() {
  return process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT ?? 8080;
}

/**
 * @description ReactFire is affected by a weird bug. We use this to check
 * that Firestore hasn't been initialized
 * @param firestore
 */
function didFirestoreInitialize(firestore: Firestore) {
  if ('_settingsFrozen' in firestore) {
    return (firestore as Firestore & { _settingsFrozen: boolean })[
      '_settingsFrozen'
    ];
  }
}

/**
 * @description Check that Cypress is attached to the global window object.
 * If so, we're running in a testing environment
 */
function isTestEnv() {
  return isBrowser() && 'Cypress' in window;
}

/**
 * @description The configuration below is needed to make Firestore work with
 * Cypress. Otherwise, it will hang.
 */
function getFirestoreConfig() {
  return isTestEnv()
    ? {
        ssl: false,
        host: '',
        experimentalForceLongPolling: true,
      }
    : {};
}
