import { useApiRequest } from '~/core/hooks/use-api';
import { MembershipRole } from '../types/membership-role';

interface Invite {
  email: string;
  role: MembershipRole;
}

export function useInviteMembers(organizationId: string) {
  return useApiRequest<void, Invite[]>(
    `/api/organizations/${organizationId}/invite`
  );
}
