import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import logger from '~/core/logger';

import {
  acceptInviteToOrganization,
  getOrganizationMembers,
} from '~/lib/server/organizations/memberships';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';

const SUPPORTED_METHODS: HttpMethod[] = ['POST', 'GET'];

async function membersHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, firebaseUser } = req;
  const userId = firebaseUser.uid;

  const { id: organizationId } = getQueryParamsSchema().parse(req.query);

  switch (method) {
    case 'GET': {
      logger.info(
        {
          organizationId,
        },
        `Fetching organization members...`
      );

      const payload = { organizationId, userId };
      const data = await getOrganizationMembers(payload);

      return res.send(data);
    }

    case 'POST': {
      await withCsrf()(req);

      const { code } = getBodySchema().parse(req.body);

      logger.info(
        {
          code,
          organizationId,
          userId,
        },
        `Adding member to organization...`
      );

      await acceptInviteToOrganization({ code, userId });

      logger.info(
        {
          code,
          organizationId,
          userId,
        },
        `Member successfully added to organization`
      );

      return res.send({ success: true });
    }
  }
}

export default function members(req: NextApiRequest, res: NextApiResponse) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
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
