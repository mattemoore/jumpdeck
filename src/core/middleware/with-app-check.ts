import type { NextApiRequest } from 'next';
import { getAppCheck } from 'firebase-admin/app-check';

import { throwUnauthorizedException } from '~/core/http-exceptions';
import configuration from '~/configuration';

const FIREBASE_APPCHECK_HEADER = 'x-firebase-appcheck';

/**
 * @name withAppCheck
 * @description Protect an API endpoint with Firebase AppCheck.
 *
 * Usage:
 *
 * 1) Simply add to your API handlers
 * export default function (req, res) {
 *   await withAppCheck(req, res);
 * }
 *
 * 2) Use with withPipe
 *
 * export default withPipe(
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
export function withAppCheck(req: NextApiRequest) {
  if (!configuration.appCheckSiteKey) {
    return;
  }

  const token = req.headers[FIREBASE_APPCHECK_HEADER];

  if (!token || typeof token !== 'string') {
    return throwUnauthorizedException();
  }

  return getAppCheck().verifyToken(token);
}
