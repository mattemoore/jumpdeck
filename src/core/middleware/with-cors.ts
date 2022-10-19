import { NextApiResponse } from 'next';

/**
 * @name withCors
 * @param res
 * @description Enables CORS for the API route
 *
 * Usage:
 * function apiHandler(req: NextApiRequest, res: NextApiResponse) {
 *  withCors(res);
 * }
 *
 * Or
 * withPipe(
 *  withCors,
 * )
 *
 */
function withCors(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, referer-path'
  );
}

export default withCors;
