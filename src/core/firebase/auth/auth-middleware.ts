import type { NextApiRequest } from 'next';
import { HttpStatusCode } from '~/core/generic';
import { getUserFromSessionCookie } from './get-user-from-session-cookie';

/**
 * @description Attaches the current Firebase User to the request
 * if available, otherwise will return an error. Only use to protect an API
 * endpoint for signed-in users
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
