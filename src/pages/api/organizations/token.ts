import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { getCurrentOrganization } from '~/lib/server/organizations/get-current-organization';

import {
  throwForbiddenException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';

async function setCurrentOrganizationCustomClaims(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.firebaseUser.uid;
  const organizationId = req.cookies.organizationId;

  if (!userId || !organizationId) {
    return throwForbiddenException();
  }

  const organization = await getCurrentOrganization(userId);

  if (!organization) {
    return throwForbiddenException();
  }

  const auth = getAuth();
  const user = await auth.getUser(userId);

  if (!user) {
    return throwNotFoundException();
  }

  await auth.setCustomUserClaims(userId, {
    ...(user.customClaims ?? {}),
    organizationId,
  });

  return res.send({ success: true });
}

export default function organizationTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(['POST']),
    withAuthedUser,
    setCurrentOrganizationCustomClaims
  );

  return withExceptionFilter(req, res)(handler);
}
