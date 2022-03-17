import type { FirebaseError } from 'firebase/app';

export function getFirebaseErrorCode(error: unknown) {
  return isFirebaseError(error) ? error.code : undefined;
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return 'code' in (error as FirebaseError);
}
