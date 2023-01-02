import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';
import { MembershipRole } from '../types/membership-role';

export function useUpdateMemberRequest({
  organizationId,
  targetMemberId,
}: {
  organizationId: string;
  targetMemberId: string;
}) {
  const fetcher = useApiRequest<void, { role: MembershipRole }>();
  const endpoint = `/api/organizations/${organizationId}/members/${targetMemberId}`;

  return useSWRMutation(endpoint, (path, { arg: body }) => {
    return fetcher({
      path,
      body,
      method: 'PUT',
    });
  });
}
