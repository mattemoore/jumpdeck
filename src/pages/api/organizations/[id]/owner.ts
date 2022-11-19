import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { UpdateData } from 'firebase-admin/firestore';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

import logger from '~/core/logger';

import {
  throwForbiddenException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import { getOrganizationById } from '~/lib/server/queries';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { Organization } from '~/lib/organizations/types/organization';
import withCsrf from '~/core/middleware/with-csrf';

const SUPPORTED_METHODS: HttpMethod[] = ['PUT'];

async function updateOrganizationOwnerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firebaseUser, query, body } = req;
  const { id: organizationId } = getQueryParamsSchema().parse(query);
  const { userId: targetUserId } = getBodySchema().parse(body);

  const currentUserId = firebaseUser.uid;
  const organizationRef = await getOrganizationById(organizationId);
  const organization = organizationRef.data();

  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserId,
    },
    `Transferring Ownership`
  );

  // we check that the organization exists
  if (!organizationRef.exists || !organization) {
    return throwNotFoundException(`Organization was not found`);
  }

  // now, we want to validate that:
  // 1. the members exist
  // 2. the member calling the action is the owner of the organization

  const members = organization.members;
  const currentUserMembership = members[currentUserId];
  const targetUserMembership = members[targetUserId];

  if (!targetUserMembership) {
    return throwNotFoundException(`Target member was not found`);
  }

  if (!currentUserMembership) {
    return throwNotFoundException(`Current member was not found`);
  }

  if (currentUserMembership.role !== MembershipRole.Owner) {
    return throwForbiddenException(`Current member is not the Owner`);
  }

  // validation finished! We should be good to go.

  // let's build the firestore update object to deeply update the nested
  // properties
  const updateData = {
    [`members.${currentUserId}.role`]: MembershipRole.Admin,
    [`members.${targetUserId}.role`]: MembershipRole.Owner,
  } as unknown as UpdateData<Organization>;

  // now we can swap the roles by updating the members' roles in the
  // organization's "members" object
  await organizationRef.ref.update(updateData);

  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserId,
    },
    `Ownership successfully transferred to target user`
  );

  res.json({ success: true });
}

export default function owner(req: NextApiRequest, res: NextApiResponse) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    updateOrganizationOwnerHandler
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
    userId: z.string().min(1),
  });
}
