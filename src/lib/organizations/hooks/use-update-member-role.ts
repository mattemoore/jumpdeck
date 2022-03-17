import { useApiRequest } from '~/core/hooks/use-api';
import { MembershipRole } from '../types/membership-role';

export function useUpdateMemberRequest({
  organizationId,
  targetMemberId,
}: {
  organizationId: string;
  targetMemberId: string;
}) {
  return useApiRequest<void, { role: MembershipRole }>(
    `/api/organizations/${organizationId}/members/${targetMemberId}`,
    'PUT'
  );
}
