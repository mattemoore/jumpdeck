import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';

type TargetMemberId = string;

function useTransferOrganizationOwnership(organizationId: string) {
  const endpoint = `/api/organizations/${organizationId}/owner`;
  const fetcher = useApiRequest<void, { targetMemberId: TargetMemberId }>();

  return useSWRMutation(endpoint, (path, { arg: body }) => {
    return fetcher({
      path,
      body,
      method: 'PUT',
    });
  });
}

export default useTransferOrganizationOwnership;
