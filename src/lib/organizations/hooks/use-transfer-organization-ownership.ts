import useSWRMutation from 'swr/mutation';
import { useApiRequest } from '~/core/hooks/use-api';

type TargetMemberId = string;

type Params = { userId: TargetMemberId };

function useTransferOrganizationOwnership(organizationId: string) {
  const endpoint = `/api/organizations/${organizationId}/owner`;
  const fetcher = useApiRequest<void, Params>();

  return useSWRMutation(endpoint, (path, { arg: body }: { arg: Params }) => {
    return fetcher({
      path,
      body,
      method: 'PUT',
    });
  });
}

export default useTransferOrganizationOwnership;
