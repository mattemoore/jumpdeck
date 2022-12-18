import { FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { ApiError } from 'next/dist/server/api-utils';

import { HttpStatusCode } from '~/core/generic';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { Organization } from '~/lib/organizations/types/organization';

import { getOrganizationById, getUserRefById } from '../queries';

import {
  throwNotFoundException,
  throwUnauthorizedException,
} from '~/core/http-exceptions';

import { getInvitesCollection } from '~/lib/server/collections';
import { MembershipInvite } from '~/lib/organizations/types/membership-invite';
import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';
import getRestFirestore from '~/core/firebase/admin/get-rest-firestore';

/**
 * @name getOrganizationMembers
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
 * @name removeMemberFromOrganization
 * @description Remove a member with ID userId from an Organization
 * @param params
 */
export async function removeMemberFromOrganization(params: {
  organizationId: string;
  targetUserId: string;
  currentUserId: string;
}) {
  const { targetUserId, currentUserId, organizationId } = params;
  const doc = await getOrganizationById(organizationId);
  const organization = doc.data();

  if (!organization) {
    throw throwNotFoundException();
  }

  assertUserCanUpdateMember({
    organization,
    currentUserId,
    targetUserId,
  });

  const memberPath = getMemberPath(targetUserId);

  await doc.ref.update({
    [memberPath]: FieldValue.delete(),
  });
}

/**
 * @name updateMemberRole
 * @description Update the role of a member within an organization
 * @param params
 */
export async function updateMemberRole(params: {
  organizationId: string;
  targetUserId: string;
  currentUserId: string;
  role: MembershipRole;
}) {
  const { role, currentUserId, targetUserId, organizationId } = params;
  const doc = await getOrganizationById(organizationId);
  const organization = doc.data();

  if (!organization) {
    throw throwNotFoundException();
  }

  assertUserCanUpdateMember({
    organization,
    currentUserId,
    targetUserId,
  });

  const user = await getUserRefById(targetUserId);
  const memberPath = getMemberPath(targetUserId);

  await doc.ref.update({
    [memberPath]: {
      role,
      user: user.ref,
    },
  });
}

/**
 * @name acceptInviteToOrganization
 * @description Add a member to an organization by using the invite code
 */
export async function acceptInviteToOrganization({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  const firestore = getRestFirestore();
  const auth = getAuth();
  const batch = firestore.batch();
  const inviteDoc = await getInviteByCode(code);

  if (!inviteDoc?.exists) {
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

/**
 * @name assertUserCanUpdateMember
 * @description Return an error when the current user cannot alter data of
 * the target user
 * @param params
 */
function assertUserCanUpdateMember(params: {
  organization: Organization;
  currentUserId: string;
  targetUserId: string;
}) {
  const members = params.organization.members;
  const currentUser = members[params.currentUserId];
  const targetUser = members[params.targetUserId];

  if (!targetUser) {
    return throwNotFoundException(`Target member was not found`);
  }

  if (!currentUser) {
    return throwNotFoundException(`Current member was not found`);
  }

  if (currentUser.role <= targetUser.role) {
    return throwUnauthorizedException(
      `Current member does not have a greater role than target member`
    );
  }
}

/**
 * @name getInviteByCode
 * @description Fetch an invite by its ID, without having to know the
 * organization it belongs to
 * @param code
 */
export async function getInviteByCode(code: string) {
  const collection = getInvitesCollection();
  const path: keyof MembershipInvite = 'code';
  const op = '==';

  const query = collection.where(path, op, code);
  const ref = await query.get();

  if (ref.size) {
    return ref.docs[0];
  }
}

/**
 * @description Get the role of a user given an organization ID
 * @param params
 */
export async function getUserRoleByOrganization(params: {
  userId: string;
  organizationId: string;
}) {
  const ref = await getOrganizationById(params.organizationId);
  const data = ref.data();

  return data?.members[params.userId]?.role;
}

/**
 * @name getOrganizationSubscription
 * @description Returns the organization's subscription
 * @param organizationId
 */
export async function getOrganizationSubscription(organizationId: string) {
  const organization = await getOrganizationById(organizationId);

  return organization.data()?.subscription;
}

/**
 * @name isOrganizationSubscriptionActive
 * @description Returns whether the organization is on any paid
 * subscription, regardless of plan.
 * @param organizationId
 */
export async function isOrganizationSubscriptionActive(organizationId: string) {
  const subscription = await getOrganizationSubscription(organizationId);

  return subscription?.status === OrganizationPlanStatus.Paid;
}
