import { useUserSession } from './use-user-session';

/**
 * @name useUserId
 * @description A hook to get the current user's ID
 */
export function useUserId() {
  const session = useUserSession();

  return session?.auth?.uid;
}
