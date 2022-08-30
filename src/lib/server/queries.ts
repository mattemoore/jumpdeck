import {
  getInvitesCollection,
  getOrganizationsCollection,
  getUsersCollection,
} from './collections';

import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

export async function getInviteByCode(code: string) {
  const codePath: keyof MembershipInvite = 'code';
  const op = '==';

  const { docs, size } = await getInvitesCollection()
    .where(codePath, op, code)
    .get();

  if (!size) {
    return;
  }

  return docs[0];
}

export async function getOrganizationById(organizationId: string) {
  const organizations = getOrganizationsCollection();

  return organizations.doc(organizationId).get();
}

export async function getUserById(userId: string) {
  const users = getUsersCollection();

  return users.doc(userId).get();
}
