import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useCallback } from 'react';

import { useRequestState } from '~/core/hooks/use-request-state';
import { Organization } from '~/lib/organizations/types/organization';
import { ORGANIZATIONS_COLLECTION } from '~/lib/firestore-collections';

/**
 * @name useUpdateOrganization
 * @description Hook to update an organization's general information (name, logo and timezone)
 */
export function useUpdateOrganization() {
  const { state, setError, setData, setLoading } =
    useRequestState<Partial<WithId<Organization>>>();

  const firestore = useFirestore();

  const updateOrganization = useCallback(
    async (organization: WithId<Partial<Organization>>) => {
      setLoading(true);

      try {
        const ref = doc(firestore, ORGANIZATIONS_COLLECTION, organization.id);

        await updateDoc(ref, {
          name: organization.name,
          logoURL: organization.logoURL,
        });

        setData(organization);
      } catch (e) {
        setError((e as FirebaseError).message);

        throw e;
      }
    },
    [firestore, setData, setError, setLoading]
  );

  return [updateOrganization, state] as [
    typeof updateOrganization,
    typeof state
  ];
}
