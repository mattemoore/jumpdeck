import type { FirebaseError } from 'firebase/app';

export function getFirebaseErrorCode(error: Maybe<unknown>) {
  if (!error) {
    return;
  }

  return isFirebaseError(error) ? error.code : undefined;
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof Error && 'code' in error;
}
