import { GlobalRole } from '~/core/session/types/global-role';

/**
 * This interface represents the user record in Firestore
 * Not to be confused with {@link User} defined in Firebase Auth
 * This data is always present in {@link UserSession}
 */
export interface UserData {
  role: GlobalRole;
}
