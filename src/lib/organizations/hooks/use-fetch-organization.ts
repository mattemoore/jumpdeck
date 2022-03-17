import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, DocumentReference } from 'firebase/firestore';
import { Organization } from '~/lib/organizations/types/organization';

type Response = WithId<Organization>;

/**
 * @name useFetchOrganization
 * @description Returns a stream with the selected organization's data
 * @param organizationId
 */
export function useFetchOrganization(organizationId: string) {
  const firestore = useFirestore();

  const ref = doc(
    firestore,
    `/organizations`,
    organizationId
  ) as DocumentReference<Response>;

  return useFirestoreDocData(ref, { idField: 'id' });
}
