import { FirebaseError } from 'firebase/app';
import { MultiFactorError } from 'firebase/auth';

export function isMultiFactorError(error: unknown): error is MultiFactorError {
  if (error instanceof FirebaseError) {
    return error.code === `auth/multi-factor-auth-required`;
  }

  return false;
}
