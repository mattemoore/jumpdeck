import { NextApiRequest } from 'next';

export function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers['x-forwarded-for'];

  return (
    (typeof forwardedFor === 'string' && forwardedFor.split(',').shift()) ||
    req.socket?.remoteAddress
  );
}
