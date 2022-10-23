import type { NextApiResponse } from 'next';
import { setCookie } from 'nookies';

const SESSION_COOKIE_NAME = `session`;
const SESSION_EXPIRES_AT_COOKIE_NAME = `sessionExpiresAt`;

/**
 * @name createSessionCookie
 * @description Given an ID Token sent by the Client SDK, create and return
 * a session cookie using Firebase Auth. The session cookie gets stored and
 * will be used for authenticating users server-side for SSR and API functions.
 * @param idToken
 * @param expiresIn
 */
export async function createSessionCookie(idToken: string, expiresIn: number) {
  const { getAuth } = await import('firebase-admin/auth');
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
    sameSite: 'Lax',
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
    sameSite: 'Lax',
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

/**
 * @name shouldUseSecureCookies
 * @description Only save cookie with secure flag if we're not in dev mode
 */
function shouldUseSecureCookies() {
  return process.env.NEXT_PUBLIC_EMULATOR !== 'true';
}
