import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';
import { MembershipRole } from '../types/membership-role';

type Params = { role: MembershipRole };

export function useUpdateMemberRequest({
  organizationId,
  targetMemberId,
}: {
  organizationId: string;
  targetMemberId: string;
}) {
  const fetcher = useApiRequest<void, Params>();
  const endpoint = `/api/organizations/${organizationId}/members/${targetMemberId}`;

  return useSWRMutation(endpoint, (path, { arg: body }: { arg: Params }) => {
    return fetcher({
      path,
      body,
      method: 'PUT',
    });
  });
}
