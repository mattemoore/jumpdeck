import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdmin } from './with-admin';
import { withMiddleware } from '~/core/middleware/with-middleware';
import { authMiddleware } from '../firebase/admin/auth/auth-middleware';

/**
 * @description
 * This middleware wraps an API handler so that the Firebase
 * admin is initialized and the request decorated with
 * the property {@link firebaseUser}
 *
 * Usage:
 * export default withAuthedUser(async (req, res) => {
 *  // your handler's logic
 * }
 *
 * @param handler
 */
export const withAuthedUser = withMiddleware(
  withAdmin,
  withAuthedUserMiddleware
);

async function withAuthedUserMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await authMiddleware(req);
  } catch (error) {
    const response = error as Response;

    return res.status(response.status).end();
  }
}
