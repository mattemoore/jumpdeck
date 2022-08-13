import { collection, CollectionReference } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import { MembershipInvite } from '~/lib/organizations/types/membership-invite';
/**
 * @description Hook to fetch the organization's invited members
 * @param organizationId
 */
export function useFetchInvitedMembers(organizationId: string) {
  const firestore = useFirestore();
  const organizationsCollection = 'organizations';
  const invitesCollection = 'invites';

  const collectionRef = collection(
    firestore,
    organizationsCollection,
    organizationId,
    invitesCollection
  ) as CollectionReference<WithId<MembershipInvite>>;

  return useFirestoreCollectionData(collectionRef, {
    idField: 'id',
  });
}
