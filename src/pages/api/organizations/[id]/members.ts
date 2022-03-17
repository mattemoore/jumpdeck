import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import logger from '~/core/logger';

import {
  acceptInviteToOrganization,
  getOrganizationMembers,
} from '~/lib/server/organizations/memberships';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

const SUPPORTED_METHODS: HttpMethod[] = ['POST', 'GET'];

async function membersHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, firebaseUser } = req;
  const { id: organizationId } = getQueryParamsSchema().parse(req.query);
  const userId = firebaseUser.uid;

  if (method === 'GET') {
    const payload = { organizationId, userId };
    const data = await getOrganizationMembers(payload);

    return res.send(data);
  }

  if (method === 'POST') {
    const { code } = getBodySchema().parse(req.body);

    await acceptInviteToOrganization({ code, userId });

    logger.info(
      {
        code,
        organizationId,
      },
      `Member added to organization`
    );

    return res.send({ success: true });
  }
}

export default function members(req: NextApiRequest, res: NextApiResponse) {
  const handler = withMiddleware(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    withExceptionFilter,
    membersHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    id: z.string().min(1),
  });
}

function getBodySchema() {
  return z.object({
    code: z.string().min(1),
  });
}
