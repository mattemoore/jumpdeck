import type { NextApiRequest } from 'next';
import { getUserFromSessionCookie } from './get-user-from-session-cookie';
import { throwForbiddenException } from '~/core/http-exceptions';

/**
 * @name authMiddleware
 * @description Attaches the current Firebase User {@link DecodedIdToken} to the
 * {@link NextApiRequest} if available, otherwise will return an {@link HttpStatusCode.Forbidden} error.
 * Only use to protect an API endpoint for signed-in users
 * @param req
 */
export async function authMiddleware(req: NextApiRequest) {
  const session = req.cookies.session;

  if (!session) {
    return throwForbiddenException();
  }

  const user = await getUserFromSessionCookie(session);

  if (user) {
    // Attaching the current Firebase user object (DecodedIdToken) to
    // NextApiRequest so that it can be used in any API handler
    req.firebaseUser = user;
  } else {
    return throwForbiddenException();
  }
}
