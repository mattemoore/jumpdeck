import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useUpdateOrganizationIdToken
 * @description Makes an HTTP request to the endpoint for updating the
 * user's custom claims with the newly selected organization ID, whhich is
 * needed for the Firebase Storage Security rules
 */
export function useUpdateOrganizationIdToken() {
  const path = `/api/organizations/token`;

  return useApiRequest(path);
}
