import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import logger from '~/core/logger';

import { MembershipRole } from '~/lib/organizations/types/membership-role';

import {
  removeMemberFromOrganization,
  updateMemberRole,
} from '~/lib/server/organizations/memberships';

import { throwBadRequestException } from '~/core/http-exceptions';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['DELETE', 'PUT'];

async function organizationMemberHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  // validate and parse query params
  const queryParamsSchema = getQueryParamsSchema().safeParse(query);

  if (!queryParamsSchema.success) {
    return throwBadRequestException(res);
  }

  const payload = {
    organizationId: queryParamsSchema.data.id,
    userId: queryParamsSchema.data.member,
  };

  // for PUT requests - update the member
  if (method === 'PUT') {
    const schema = getUpdateMemberSchema();
    const { role } = schema.parse(req.body);
    const updatePayload = { ...payload, role };

    await updateMemberRole(updatePayload);

    logger.info(updatePayload, `User role updated`);

    return res.send({ success: true });
  }

  // for DELETE requests - remove the member
  if (method === 'DELETE') {
    await removeMemberFromOrganization(payload);

    logger.info(payload, `User removed from organization`);

    return res.send({ success: true });
  }
}

export default function membersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    organizationMemberHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getUpdateMemberSchema() {
  return z.object({
    role: z.nativeEnum(MembershipRole),
  });
}

function getQueryParamsSchema() {
  return z.object({
    id: z.string(),
    member: z.string(),
  });
}
