import { useApiRequest } from '~/core/hooks/use-api';

interface AddMemberToOrganizationProps {
  // the code generated when creating the invitation
  code: string;
}

/**
 * @name useAddMemberToOrganization
 * @description Add a member to an organization using an HTTP request to the
 * member API endpoint.
 * @param id
 */
function useAddMemberToOrganization(id: string) {
  const path = `/api/organizations/${id}/members`;

  return useApiRequest<void, AddMemberToOrganizationProps>(path);
}

export default useAddMemberToOrganization;
