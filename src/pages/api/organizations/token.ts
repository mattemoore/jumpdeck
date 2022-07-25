import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { getCurrentOrganization } from '~/lib/server/organizations/get-current-organization';
import { forbiddenException, notFoundException } from '~/core/http-exceptions';

export async function organizationTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.firebaseUser.uid;
  const organizationId = req.cookies.organizationId;

  if (!userId || !organizationId) {
    return forbiddenException(res);
  }

  const organization = await getCurrentOrganization(userId);

  if (!organization) {
    return forbiddenException(res);
  }

  const auth = getAuth();
  const user = await auth.getUser(userId);

  if (!user) {
    return notFoundException(res);
  }

  await auth.setCustomUserClaims(userId, {
    ...(user.customClaims ?? {}),
    organizationId,
  });

  return res.send({ success: true });
}

export default withMiddleware(
  withMethodsGuard(['POST']),
  withAuthedUser,
  organizationTokenHandler
);
