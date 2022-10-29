import { NextApiRequest } from 'next';
import Csrf from 'csrf';

import { throwUnauthorizedException } from '~/core/http-exceptions';

/**
 * @name withCsrf
 * @description Add CSRF protection to an API endpoint
 * @param tokenProvider
 *
 * Usage:
 *
 * With a pipe:
 * export withPipe(
 *    withCsrf(),
 *
 *    // you can customize the retrieval of CSRF token
 *    withCsrf(req => req.body.csrfToken)
 * )
 *
 * Or within an API handler:
 *
 * function myHandler(req: NextApiRequest) {
 *  await withCsrf()(req)
 * }
 */
function withCsrf(tokenProvider = defaultTokenProvider) {
  return async (req: NextApiRequest) => {
    const csrf = new Csrf();
    const secret = req.cookies.csrfSecret;
    const token = await tokenProvider(req);

    // when signing programmatically (i.e. during tests)
    // we should skip the validation of the token
    if (isTestingToken(token)) {
      return;
    }

    if (!token) {
      return throwUnauthorizedException(`CSRF token is invalid`);
    }

    if (!secret) {
      return throwUnauthorizedException(`CSRF secret not found`);
    }

    if (!csrf.verify(secret, token)) {
      return throwUnauthorizedException(`CSRF check failed`);
    }
  };
}

/**
 * @name defaultTokenProvider
 * @description the default token provider takes the x-csrf-token header
 * Can be customized, for example, when the token is passed from the body:
 *
 * withPipe(
 *  withCsrf(req => req.body.csrfToken),
 * )
 *
 * @param req
 */
async function defaultTokenProvider(req: NextApiRequest) {
  return req.headers['x-csrf-token'] as string;
}

function isTest() {
  return process.env.IS_CI === 'true';
}

function isTestingToken(token: string) {
  return isTest() && isMockToken(token);
}

function isMockToken(token: string) {
  return token && token === process.env.CSRF_MOCK_TOKEN;
}

export default withCsrf;
