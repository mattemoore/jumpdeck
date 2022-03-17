import { FirebaseError } from 'firebase/app';

import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  DocumentReference,
} from 'firebase/firestore';

import { useUser } from 'reactfire';

import { useRequestState } from '~/core/hooks/use-request-state';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { Organization } from '~/lib/organizations/types/organization';
import { UserData } from '~/lib/organizations/types/user-data';

/**
 * @name useCreateOrganization
 * @description Hook to create a new organization
 */
export function useCreateOrganization() {
  const user = useUser();
  const userId = user.data?.uid as string;

  const { state, setError, setData, setLoading } =
    useRequestState<WithId<Organization>>();

  async function createOrganization(name: string) {
    const firestore = getFirestore();
    const batch = writeBatch(firestore);

    try {
      setLoading(true);

      const organizations = collection(firestore, 'organizations');

      const userDoc = doc(
        firestore,
        `users`,
        userId
      ) as DocumentReference<UserData>;

      const organizationDoc = doc(organizations);

      const organizationData = {
        name,
        members: {
          [userDoc.id]: {
            role: MembershipRole.Owner,
            user: userDoc,
          },
        },
      };

      batch.set(organizationDoc, organizationData);

      await batch.commit();

      setData({
        name,
        id: organizationDoc.id,
        members: {
          [userDoc.id]: {
            role: MembershipRole.Owner,
            user: userDoc,
          },
        },
      });
    } catch (e) {
      setError((e as FirebaseError).message);
    }
  }

  return [createOrganization, state] as [
    typeof createOrganization,
    typeof state
  ];
}
