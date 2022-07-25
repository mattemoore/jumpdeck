import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

/**
 * @description Get the logged in user object {@link DecodedIdToken}
 * using the session cookie
 * @param ctx
 */
export async function getLoggedInUser(ctx: GetServerSidePropsContext) {
  const { getUserFromSessionCookie } = await import(
    './get-user-from-session-cookie'
  );

  const { session } = nookies.get(ctx);

  if (!session) {
    return Promise.reject(`Session not found`);
  }

  return getUserFromSessionCookie(session);
}
