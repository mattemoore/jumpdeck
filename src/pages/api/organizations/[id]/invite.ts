import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import logger from '~/core/logger';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { inviteMembers } from '~/lib/server/organizations/invite-members';
import { withAuthedUser } from '~/core/middleware/with-authed-user';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

const SUPPORTED_METHODS: HttpMethod[] = ['POST'];

async function inviteMembersToOrganizationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const queryParamsSchemaResult = getQueryParamsSchema().safeParse(query);

  if (!queryParamsSchemaResult.success) {
    return throwBadRequestException();
  }

  const bodySchemaResult = getBodySchema().safeParse(req.body);

  if (!bodySchemaResult.success) {
    return throwBadRequestException();
  }

  const { id: organizationId } = queryParamsSchemaResult.data;
  const invites = bodySchemaResult.data;
  const inviterId = req.firebaseUser.uid;

  try {
    await inviteMembers({
      organizationId,
      inviterId,
      invites,
    });

    logger.info(
      {
        organizationId,
      },
      `User invited to organization`
    );

    return res.send({ success: true });
  } catch (e) {
    logger.error(
      {
        organizationId,
        inviterId,
      },
      `Error occurred when inviting user to organization`
    );

    logger.debug(e);

    return throwInternalServerErrorException();
  }
}

export default function inviteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    inviteMembersToOrganizationHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    id: z.string().min(1),
  });
}

function getBodySchema() {
  return z.array(
    z.object({
      role: z.nativeEnum(MembershipRole),
      email: z.string().email(),
    })
  );
}
