import { useEffect } from 'react';
import type { User } from 'firebase/auth';

import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useFetchOrganizationMembersMetadata
 * @param organizationId
 */
export function useFetchOrganizationMembersMetadata(organizationId: string) {
  const path = `/api/organizations/${organizationId}/members`;
  const [fetchMembersRequest, state] = useApiRequest<User[]>(path, 'GET');

  useEffect(() => {
    void fetchMembersRequest();
  }, [organizationId, fetchMembersRequest]);

  return state;
}
