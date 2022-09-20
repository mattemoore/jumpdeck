import { collection, CollectionReference } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

import {
  INVITES_COLLECTION,
  ORGANIZATIONS_COLLECTION,
} from '~/lib/firestore-collections';

/**
 * @description Hook to fetch the organization's invited members
 * @param organizationId
 */
export function useFetchInvitedMembers(organizationId: string) {
  const firestore = useFirestore();

  const collectionRef = collection(
    firestore,
    ORGANIZATIONS_COLLECTION,
    organizationId,
    INVITES_COLLECTION
  ) as CollectionReference<WithId<MembershipInvite>>;

  return useFirestoreCollectionData(collectionRef, {
    idField: 'id',
  });
}
