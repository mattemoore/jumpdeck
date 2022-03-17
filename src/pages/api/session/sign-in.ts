import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { setCookie } from 'nookies';
import { getAuth } from 'firebase-admin/auth';

import { withAdmin } from '~/core/middleware/with-admin';
import logger from '~/core/logger';

import {
  badRequestException,
  unauthorizedException,
} from '~/core/http-exceptions';

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
    const auth = getAuth();
    const expiresIn = getCookieTTL();

    // create a session cookie using Firebase Auth by passing
    // to it the idToken returned by the client-side SDK
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // save token as an HTTP-only cookie
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

/**
 *
 * @param days the number of days to keep the session-cookie working. By default, it is 14 days
 * @returns number
 */
function getCookieTTL(days = 14) {
  const oneDayToMs = 8.64e7;

  return oneDayToMs * days;
}

function getBodySchema() {
  return z.object({
    idToken: z.string(),
    csrfToken: z.string(),
  });
}

function saveSessionCookie(
  res: NextApiResponse,
  sessionCookie: string,
  expiresIn: number
) {
  // only save cookie with secure flag if we're not in dev mode
  const secure = process.env.NEXT_PUBLIC_EMULATOR !== 'true';

  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure,
    path: '/',
  };

  // when the session-cookie gets created
  // we store it as an httpOnly cookie (important!)
  setCookie({ res }, 'session', sessionCookie, options);
}
