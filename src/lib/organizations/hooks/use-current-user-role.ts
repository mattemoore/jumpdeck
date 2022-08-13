import { useCurrentOrganization } from './use-current-organization';
import { useUserSession } from '~/core/hooks/use-user-session';

/**
 * @name useCurrentUserRole
 * @description Hook to fetch the user's current role {@link MembershipRole}
 */
export function useCurrentUserRole() {
  const organization = useCurrentOrganization();
  const user = useUserSession();
  const userId = user?.auth?.uid;

  if (!userId) {
    return;
  }

  return organization?.members[userId]?.role;
}
