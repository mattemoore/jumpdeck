import { getOrganizationsCollection, getUsersCollection } from './collections';

/**
 * @name getOrganizationById
 * @description Returns the Firestore reference of the organization by its ID
 * {@link organizationId}
 * @param organizationId
 */
export async function getOrganizationById(organizationId: string) {
  const organizations = getOrganizationsCollection();

  return organizations.doc(organizationId).get();
}

/**
 * @name getUserRefById
 * @description Returns the Firestore reference of the user by its ID {@link userId}
 * @param userId
 */
export async function getUserRefById(userId: string) {
  const users = getUsersCollection();

  return users.doc(userId).get();
}

/**
 * @description Fetch user Firestore object data (not auth!) by ID {@link userId}
 * @param userId
 */
export async function getUserData(userId: string) {
  const user = await getUserRefById(userId);
  const data = user.data();

  if (data) {
    return {
      ...data,
      id: user.id,
    };
  }
}
