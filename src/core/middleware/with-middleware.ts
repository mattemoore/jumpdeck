import { NextApiRequest, NextApiResponse } from 'next';

type Middleware = (req: NextApiRequest, res: NextApiResponse) => unknown;

/**
 * @name withMiddleware
 * @description combine multiple middleware before handling your API endpoint
 * @param middlewares
 */
export function withMiddleware(...middlewares: Middleware[]) {
  return async function withMiddlewareHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    for (const middleware of middlewares) {
      // return early when the request has
      // been ended by a previous middleware
      if (res.headersSent) {
        return;
      }

      await middleware(req, res);
    }
  };
}
