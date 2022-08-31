import { withAdmin } from './with-admin';
import { withPipe } from '~/core/middleware/with-pipe';
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
 * Or use with a pipe:
 *
 * export default withPipe(
 *    withAuthedUser,
 *    (req, res) => {
 *      res.send([]);
 *    }
 * )
 *
 */
export const withAuthedUser = withPipe(withAdmin, authMiddleware);
