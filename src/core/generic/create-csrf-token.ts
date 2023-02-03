import Csrf from 'csrf';
import { setCookie } from 'nookies';
import type { GetServerSidePropsContext } from 'next';

const COOKIE_KEY = 'csrfSecret';

/**
 * @name createCsrfCookie
 * @description Creates a CSRF secret cookie and returns the CSRF token to be
 * sent to the client-side. The client-side will return this token in the
 * HTTP request header.
 * @param ctx
 */
async function createCsrfCookie(ctx: GetServerSidePropsContext) {
  const csrf = new Csrf();
  const existingSecret = ctx.req.cookies[COOKIE_KEY];

  if (existingSecret) {
    return csrf.create(existingSecret);
  }

  const secret = await csrf.secret();

  // set a CSRF token secret, so we can validate it on POST requests
  setCookie(ctx, COOKIE_KEY, secret, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === `production`,
    sameSite: 'Strict',
  });

  return csrf.create(secret);
}

export default createCsrfCookie;
