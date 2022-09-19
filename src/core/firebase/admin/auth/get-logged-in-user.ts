import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';

/**
 * @description Get the logged in user object using the session cookie
 * @param ctx
 */
export async function getLoggedInUser(ctx: GetServerSidePropsContext) {
  const { session } = parseCookies(ctx);

  if (!session) {
    return Promise.reject(`Session ID not found`);
  }

  const { getUserFromSessionCookie } = await import(
    './get-user-from-session-cookie'
  );

  return getUserFromSessionCookie(session);
}
