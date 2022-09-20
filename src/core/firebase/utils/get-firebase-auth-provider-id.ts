import FirebaseAuthProviderClass from '~/core/firebase/types/auth-provider-class';
import { EmailAuthProvider, PhoneAuthProvider } from 'firebase/auth';

const cache = new WeakMap();

/**
 * @name getFirebaseAuthProviderId
 * @param AuthProviderClass
 */
function getFirebaseAuthProviderId(
  AuthProviderClass:
    | FirebaseAuthProviderClass
    | typeof EmailAuthProvider
    | typeof PhoneAuthProvider
) {
  if (cache.has(AuthProviderClass)) {
    return cache.get(AuthProviderClass);
  }

  // if it's a default Firebase Auth class
  // we have already the ID defined as PROVIDER_ID
  if ('PROVIDER_ID' in AuthProviderClass) {
    const id = AuthProviderClass.PROVIDER_ID as string;

    cache.set(AuthProviderClass, id);

    return id;
  }

  // if it's a custom AuthProvider, we need to get the ID by instantiating it
  const id = new AuthProviderClass().providerId;

  cache.set(AuthProviderClass, id);

  return id;
}

export default getFirebaseAuthProviderId;
