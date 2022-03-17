import { getOrganizationsCollection } from '~/lib/server/collections';

/**
 * @description Get all the organizations where the user (by ID) is a member
 * @param userId
 */
export function getOrganizationsByUserId(userId: string) {
  const organizations = getOrganizationsCollection();
  const path = `members.${userId}`;

  return organizations.where(path, '!=', null);
}
