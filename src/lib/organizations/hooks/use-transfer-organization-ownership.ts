import { useApiRequest } from '~/core/hooks/use-api';

type TargetMemberId = string;

function useTransferOrganizationOwnership(organizationId: string) {
  return useApiRequest<void, { userId: TargetMemberId }>(
    `/api/organizations/${organizationId}/owner`,
    'PUT'
  );
}

export default useTransferOrganizationOwnership;
