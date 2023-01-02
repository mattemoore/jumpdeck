import type { User } from 'firebase/auth';
import useSWR from 'swr';

import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useFetchOrganizationMembersMetadata
 * @param organizationId
 */
export function useFetchOrganizationMembersMetadata(organizationId: string) {
  const endpoint = getFetchMembersPath(organizationId);
  const fetcher = useApiRequest<User[]>();

  return useSWR(endpoint, (path) => {
    return fetcher({ path, method: 'GET' });
  });
}

function getFetchMembersPath(organizationId: string) {
  return `/api/organizations/${organizationId}/members`;
}
