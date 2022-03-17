import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { ApiError } from 'next/dist/server/api-utils';

import { HttpStatusCode } from '~/core/generic';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { Organization } from '~/lib/organizations/types/organization';

import { getInviteByCode, getOrganizationById, getUserById } from '../queries';

/**
 * @description Returns the {@link UserInfo} object from the members of an organization
 */
export async function getOrganizationMembers(params: {
  organizationId: string;
  userId: string;
}) {
  const auth = getAuth();
  const ref = await getOrganizationById(params.organizationId);
  const organization = ref.data();

  // forbid requests if the user does not belong to the organization
  const userIsMember = params.userId in (organization?.members ?? {});

  if (!organization || !userIsMember) {
    throw new ApiError(HttpStatusCode.Forbidden, `Action Forbidden`);
  }

  const members = Object.values(organization.members);
  const data = members.map(({ user }) => auth.getUser(user.id));

  return Promise.all(data);
}

/**
 * @description Remove a member with ID userId from an Organization
 * @param params
 */
export async function removeMemberFromOrganization(params: {
  organizationId: string;
  userId: string;
}) {
  const { userId, organizationId } = params;
  const organization = await getOrganizationById(organizationId);
  const memberPath = getMemberPath(userId);

  await organization.ref.update({
    [memberPath]: FieldValue.delete(),
  });
}

/**
 * @description Update the role of a member within an organization
 * @param params
 */
export async function updateMemberRole(params: {
  organizationId: string;
  userId: string;
  role: MembershipRole;
}) {
  const { role, userId, organizationId } = params;

  const organization = await getOrganizationById(organizationId);
  const user = await getUserById(userId);
  const memberPath = getMemberPath(userId);

  await organization.ref.update({
    [memberPath]: {
      role,
      user: user.ref,
    },
  });
}

/**
 * @description Add a member to an organization by using the invite code
 */
export async function acceptInviteToOrganization({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  const firestore = getFirestore();
  const auth = getAuth();
  const batch = firestore.batch();
  const inviteDoc = await getInviteByCode(code);

  if (!inviteDoc.exists) {
    throw new ApiError(HttpStatusCode.NotFound, `Invite not found`);
  }

  const invite = inviteDoc.data();
  const currentTime = new Date().getTime();
  const isInviteExpired = currentTime > invite.expiresAt;

  if (isInviteExpired) {
    await inviteDoc.ref.delete();

    throw new Error(`Invite is expired`);
  }

  const organizationId = invite.organization.id;
  const role = invite.role;
  const userPath = `/users/${userId}`;

  const organizationRef = firestore.doc(`/organizations/${organizationId}`);
  const userRef = firestore.doc(userPath);

  // update the organization members list
  const memberPath = getMemberPath(userId);

  batch.update(organizationRef, {
    [memberPath]: {
      user: userRef,
      role,
    },
  });

  // create the user record
  batch.set(userRef, {}, {});

  // delete the invite
  batch.delete(inviteDoc.ref);

  // automatically set the user as "onboarded"
  await auth.setCustomUserClaims(userId, {
    onboarded: true,
  });

  await batch.commit();
}

function getMemberPath(userId: string) {
  const membersPropertyKey: keyof Organization = 'members';

  return `${membersPropertyKey}.${userId}`;
}
