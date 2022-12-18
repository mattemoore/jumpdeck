import { getFirestore, Firestore } from 'firebase-admin/firestore';
import configuration from '~/configuration';

let firestore: Firestore;

/**
 * @name getRestFirestore
 * @description Get the Firestore instance with REST API enabled. This is
 * faster than the default Firestore instance which uses GRPC.
 */
function getRestFirestore() {
  // prevent multiple instances of Firestore
  if (firestore) {
    return firestore;
  }

  firestore = getFirestore();

  // prevent re-initialization of Firestore
  if (!isFirestoreInitialized(firestore)) {
    // enable REST API for faster Firestore operations
    // we disable it by default because it's not yet compatible with the emulator
    const preferRest = !configuration.emulator;

    firestore.settings({
      preferRest,
    });
  }

  return firestore;
}

export default getRestFirestore;

function isFirestoreInitialized(instance: Firestore) {
  // this key is set when the Firestore instance is initialized
  const key = '_settingsFrozen';

  return !(key in instance) || (key in instance && instance[key]);
}
