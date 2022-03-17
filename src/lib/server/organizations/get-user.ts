import { getUserById } from '../queries';

/**
 * @description Fetch user Firestore object (not auth) by ID
 * @param userId
 */
export async function getUser(userId: string) {
  const user = await getUserById(userId);
  const data = user.data();

  if (data) {
    return {
      ...data,
      id: user.id,
    };
  }
}
