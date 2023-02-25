import { useApiRequest } from '~/core/hooks/use-api';
import useSWRMutation from 'swr/mutation';

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
  const endpoint = `/api/organizations/${id}/members`;
  const fetcher = useApiRequest<void, AddMemberToOrganizationProps>();

  return useSWRMutation(
    endpoint,
    (path, { arg: body }: { arg: AddMemberToOrganizationProps }) => {
      return fetcher({
        path,
        body,
      });
    }
  );
}

export default useAddMemberToOrganization;
