import { NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowedException } from '~/core/http-exceptions';

/**
 * @description guard an API endpoint against unsupported methods
 * @param methods
 */
export function withMethodsGuard(methods: HttpMethod[]) {
  return function methodsGuard(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method as HttpMethod;

    if (!methods.includes(method)) {
      methodNotAllowedException(res, methods, method);
    }
  };
}
