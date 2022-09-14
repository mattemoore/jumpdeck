import { NextApiResponse } from 'next';
import { setCookie } from 'nookies';
import { getAuth } from 'firebase-admin/auth';

const SESSION_COOKIE_NAME = `session`;
const SESSION_EXPIRES_AT_COOKIE_NAME = `sessionExpiresAt`;

export function createSessionCookie(idToken: string, expiresIn: number) {
  const auth = getAuth();

  // create a session cookie using Firebase Auth by passing
  // to it the idToken returned by the client-side SDK
  return auth.createSessionCookie(idToken, {
    expiresIn,
  });
}

export function saveSessionCookie(
  res: NextApiResponse,
  sessionCookie: string,
  expiresIn: number
) {
  setSessionCookie(res, SESSION_COOKIE_NAME, sessionCookie, expiresIn);
  setSessionExpiryCookie(res, expiresIn);
}

/**
 *
 * @param days the number of days to keep the session-cookie working. By default, it is 14 days
 * @returns number
 */
export function getSessionCookieTTL(days = 14) {
  const oneDayToMs = 8.64e7;

  return oneDayToMs * days;
}

function setSessionCookie(
  res: NextApiResponse,
  cookieName: string,
  cookieValue: string,
  expiresIn: number
) {
  // only save cookie with secure flag if we're not in dev mode
  const secure = process.env.NEXT_PUBLIC_EMULATOR !== 'true';

  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure,
    path: '/',
    sameSite: 'Strict',
  };

  // when the session-cookie gets created
  // we store it as an httpOnly cookie (important!)
  setCookie({ res }, cookieName, cookieValue, options);
}

function setSessionExpiryCookie(res: NextApiResponse, expiresIn: number) {
  const secure = shouldUseSecureCookies();

  const options = {
    maxAge: expiresIn,
    httpOnly: false,
    secure,
    path: '/',
    sameSite: 'Strict',
  };

  const date = new Date();
  const expiresAt = new Date(date.toISOString()).getTime() + expiresIn;

  // when the session-cookie gets created
  // we store it as an httpOnly cookie (important!)
  setCookie(
    { res },
    SESSION_EXPIRES_AT_COOKIE_NAME,
    expiresAt.toString(),
    options
  );
}

// only save cookie with secure flag if we're not in dev mode
function shouldUseSecureCookies() {
  return process.env.NEXT_PUBLIC_EMULATOR !== 'true';
}
