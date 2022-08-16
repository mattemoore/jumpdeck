import type { NextApiRequest, NextApiResponse } from 'next';
import { getAppCheck } from 'firebase-admin/app-check';
import { forbiddenException } from '~/core/http-exceptions';

const FIREBASE_APPCHECK_HEADER = 'X-Firebase-AppCheck';

/**
 * @name appCheckMiddleware
 * @description Protect an API endpoint with Firebase AppCheck.
 *
 * Usage:
 *
 * 1) Simply add to your API handlers
 * export default function (req, res) {
 *   await withAppCheck(req, res);
 * }
 *
 * 2) Use with withMiddleware
 *
 * export default withMiddleware(
 *   withAdmin,
 *   withAppCheck,
 *   (req, res) => {
 *     // your handler
 *   }
 * )
 *
 * Do not use if:
 * - AppCheck is not configured
 * - The request is not expected from users (for example, webhooks)
 *
 * Use if:
 * - You expect the requests to come from the application UI
 */
export async function withAppCheck(req: NextApiRequest, res: NextApiResponse) {
  const appCheck = getAppCheck();
  const token = req.headers[FIREBASE_APPCHECK_HEADER];

  const forbidden = () => forbiddenException(res);

  if (!token || typeof token !== 'string') {
    return forbidden();
  }

  try {
    await appCheck.verifyToken(token);
  } catch (e) {
    return forbidden();
  }
}
