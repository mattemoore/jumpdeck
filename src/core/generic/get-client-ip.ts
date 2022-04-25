import { NextApiRequest } from 'next';

/**
 * @name getClientIp
 * @param req
 */
export function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers['x-forwarded-for'];

  return (
    (typeof forwardedFor === 'string' && forwardedFor.split(',').shift()) ||
    req.socket?.remoteAddress
  );
}
