import { useUserSession } from './use-user-session';

export function useUserId() {
  const session = useUserSession();

  return session?.auth?.uid;
}
