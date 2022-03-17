import { canInviteUsers } from '~/lib/organizations/permissions';
import { useCurrentUserRole } from './use-current-user-role';

export function useUserCanInviteUsers() {
  const role = useCurrentUserRole();

  return role !== undefined && canInviteUsers(role);
}
