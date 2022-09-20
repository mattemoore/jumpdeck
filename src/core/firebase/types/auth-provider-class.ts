import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  PhoneAuthProvider,
  TwitterAuthProvider,
} from 'firebase/auth';

/**
 * @name FirebaseAuthProviderClass
 * @description A useful generic type to identify Firebase's Auth providers
 */
type FirebaseAuthProviderClass =
  | typeof GoogleAuthProvider
  | typeof GithubAuthProvider
  | typeof TwitterAuthProvider
  | typeof FacebookAuthProvider
  | typeof EmailAuthProvider
  | typeof PhoneAuthProvider
  | ({ new (): OAuthProvider } & typeof OAuthProvider);

export default FirebaseAuthProviderClass;
