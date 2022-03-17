import {
  collection,
  where,
  query,
  CollectionReference,
} from 'firebase/firestore';

import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Organization } from '~/lib/organizations/types/organization';

/**
 * @description Hook to fetch the user's organizations
 * @param userId
 */
export function useFetchUserOrganizations(userId: string) {
  const firestore = useFirestore();
  const path = `organizations`;

  const organizationsCollection = collection(
    firestore,
    path
  ) as CollectionReference<WithId<Organization>>;

  const userPath = `members.${userId}`;
  const operator = '!=';

  // we query Firestore for all the organizations
  // where the user is a member, therefore where he path
  // members.<user_id> is not null
  const constraint = where(userPath, operator, null);
  const organizationsQuery = query(organizationsCollection, constraint);

  return useFirestoreCollectionData(organizationsQuery, {
    idField: `id`,
    initialData: [],
  });
}
