import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

import logger from '~/core/logger';

import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import { withAdmin } from '~/core/middleware/with-admin';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRES_AT_COOKIE_NAME = 'sessionExpiresAt';
const SESSION_CSRF_SECRET_COOKIE = `csrfSecret`;

const COOKIE_PATH = '/';
const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

/**
 * @description
 * Revoke the session cookie when the user signs-out client-side
 * and redirect to the home page.
 * If any error occurs, the user is redirected to the home page
 */
async function signOut(req: NextApiRequest, res: NextApiResponse) {
  const sessionCookie = req.cookies[SESSION_COOKIE_NAME];

  const ok = () => res.send({ success: true });

  // if the session cookies does not exist
  // we cannot delete nor sign the user out
  // so, we end the request
  if (!sessionCookie) {
    logger.warn(`No session cookie was provided`);

    return ok();
  }

  try {
    // revoke cookie with Firebase Auth
    await revokeCookie(sessionCookie);

    destroySessionCookies(res);
  } catch (e) {
    logger.warn(e, `Could not destroy user's session`);
  }

  return res.send({ success: true });
}

export default function sessionSignOutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAdmin,
    signOut
  );

  return withExceptionFilter(req, res)(handler);
}

async function revokeCookie(sessionCookie: string) {
  const { getAuth } = await import('firebase-admin/auth');
  const auth = getAuth();
  const { sub } = await auth.verifySessionCookie(sessionCookie);

  return auth.revokeRefreshTokens(sub);
}

/**
 * @description destroy session cookies to sign user out
 * @param res
 */
function destroySessionCookies(res: NextApiResponse) {
  const options = { path: COOKIE_PATH };

  destroyCookie({ res }, SESSION_COOKIE_NAME, options);
  destroyCookie({ res }, SESSION_EXPIRES_AT_COOKIE_NAME, options);
  destroyCookie({ res }, SESSION_CSRF_SECRET_COOKIE, options);
}
