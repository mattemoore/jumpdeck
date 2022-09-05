import { useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';

import { useApiRequest } from '~/core/hooks/use-api';

/**
 * @name useFetchOrganizationMembersMetadata
 * @param organizationId
 */
export function useFetchOrganizationMembersMetadata(organizationId: string) {
  const requestDone = useRef<boolean>(false);
  const path = getFetchMembersPath(organizationId);
  const [fetchMembersRequest, state] = useApiRequest<User[]>(path, 'GET');

  useEffect(() => {
    // prevent repeated requests in dev mode
    if (requestDone.current) {
      return;
    }

    void fetchMembersRequest();

    requestDone.current = true;
  }, [organizationId, fetchMembersRequest]);

  return state;
}

function getFetchMembersPath(organizationId: string) {
  return `/api/organizations/${organizationId}/members`;
}
