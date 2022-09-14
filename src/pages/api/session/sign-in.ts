import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import logger from '~/core/logger';

import {
  throwBadRequestException,
  throwUnauthorizedException,
} from '~/core/http-exceptions';

import {
  createSessionCookie,
  getSessionCookieTTL,
  saveSessionCookie,
} from '~/lib/server/auth/save-session-cookie';

import { withAdmin } from '~/core/middleware/with-admin';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

/**
 * @description This API endpoint starts a new session by passing an IdToken to
 * Firebase Auth, and creates a session cookie that allows us to authenticate
 * the user server-side
 */
async function signIn(req: NextApiRequest, res: NextApiResponse) {
  // we validate the body to have the correct values
  // and respond with an error if it does not
  const body = getBodySchema().safeParse(req.body);

  if (!body.success) {
    return throwBadRequestException();
  }

  // this is the ID token that is retrieved
  // by the client side sign-in with Firebase
  // we will use it to create a session cookie
  const { idToken } = body.data;

  try {
    // save token as an HTTP-only cookie
    const expiresIn = getSessionCookieTTL();
    const sessionCookie = await createSessionCookie(idToken, expiresIn);

    saveSessionCookie(res, sessionCookie, expiresIn);

    return res.send({ success: true });
  } catch (e) {
    logger.error(e);

    return throwUnauthorizedException();
  }
}

export default function sessionSignInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAdmin,
    signIn
  );

  return withExceptionFilter(req, res)(handler);
}

function getBodySchema() {
  return z.object({
    idToken: z.string(),
  });
}
