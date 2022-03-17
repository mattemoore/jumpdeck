import { useCallback, useEffect } from 'react';
import type { User } from 'firebase/auth';

import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useFetchOrganizationMembersMetadata
 * @param organizationId
 */
export function useFetchOrganizationMembersMetadata(organizationId: string) {
  const path = `/api/organizations/${organizationId}/members`;
  const [request, state] = useApiRequest<User[]>(path, 'GET');

  const fetchMembersRequestCallback = useCallback(() => {
    if (organizationId) {
      void request();
    }
  }, [organizationId, request]);

  useEffect(() => {
    fetchMembersRequestCallback();
  }, [organizationId, fetchMembersRequestCallback]);

  return state;
}
