import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpStatusCode } from '~/core/generic';
import { getUserFromSessionCookie } from './get-user-from-session-cookie';
import { forbiddenException } from '~/core/http-exceptions';

/**
 * @name authMiddleware
 * @description Attaches the current Firebase User {@link DecodedIdToken} to the
 * {@link NextApiRequest} if available, otherwise will return an {@link HttpStatusCode.Forbidden} error.
 * Only use to protect an API endpoint for signed-in users
 * @param req
 * @param res
 */
export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = req.cookies.session;
  const forbidden = () => forbiddenException(res);

  if (!session) {
    return forbidden();
  }

  try {
    const user = await getUserFromSessionCookie(session);

    if (user) {
      // Attaching the current Firebase user object (DecodedIdToken) to
      // NextApiRequest so that it can be used in any API handler
      req.firebaseUser = user;
    } else {
      return forbidden();
    }
  } catch (e) {
    return forbidden();
  }
}