import { getAuth } from 'firebase-admin/auth';

/**
 * @name getUserFromSessionCookie
 * @description Gets the current ID token from session cookie
 * @param session
 */
export async function getUserFromSessionCookie(session: string) {
  const auth = getAuth();

  return auth.verifySessionCookie(session, true);
}
