import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import logger from '~/core/logger';

import {
  badRequestException,
  unauthorizedException,
} from '~/core/http-exceptions';

import {
  createSessionCookie,
  getSessionCookieTTL,
  saveSessionCookie,
} from '~/lib/server/auth/save-session-cookie';

import { withAdmin } from '~/core/middleware/with-admin';
import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

/**
 * @description This API endpoint starts a new session by passing an IdToken to
 * Firebase Auth, and creates a session cookie that allows us to authenticate
 * the user server-side
 */
async function signIn(req: NextApiRequest, res: NextApiResponse) {
  const { cookies } = req;

  // we validate the body to have the correct values
  // and respond with an error if it does not
  const body = getBodySchema().safeParse(req.body);

  if (!body.success) {
    return badRequestException(res);
  }

  // this is the ID token that is retrieved
  // by the client side sign-in with Firebase
  // we will use it to create a session cookie
  const { csrfToken, idToken } = body.data;

  // we need to check that the CSRF token in the body
  // matches the relative token in the cookies
  if (csrfToken !== cookies.csrfToken) {
    return unauthorizedException(res);
  }

  try {
    // save token as an HTTP-only cookie
    const expiresIn = getSessionCookieTTL();
    const sessionCookie = await createSessionCookie(idToken, expiresIn);

    saveSessionCookie(res, sessionCookie, expiresIn);

    return res.send({ success: true });
  } catch (e) {
    logger.error(e);

    return unauthorizedException(res);
  }
}

export default function sessionSignInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withMiddleware(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAdmin,
    signIn
  );

  return withExceptionFilter(req, res)(handler);
}

function getBodySchema() {
  return z.object({
    idToken: z.string(),
    csrfToken: z.string(),
  });
}
