import type { NextApiRequest } from 'next';
import { HttpStatusCode } from '~/core/generic';
import { getUserFromSessionCookie } from './get-user-from-session-cookie';

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

function forbidden() {
  return new Response('Forbidden', { status: HttpStatusCode.Forbidden });
}
