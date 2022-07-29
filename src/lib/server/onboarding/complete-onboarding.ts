import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { GlobalRole } from '~/core/session/types/global-role';

import { getOrganizationsCollection, getUsersCollection } from '../collections';

interface Params {
  organizationName: string;
  userId: string;
}

export async function completeOnboarding({ userId, organizationName }: Params) {
  const firestore = getFirestore();
  const auth = getAuth();

  const batch = firestore.batch();

  const organizationRef = getOrganizationsCollection().doc();
  const userRef = getUsersCollection().doc(userId);

  const organizationMembers = {
    [userId]: {
      user: userRef,
      role: MembershipRole.Owner,
    },
  };

  // create organization
  batch.create(organizationRef, {
    name: organizationName,
    members: organizationMembers,
  });

  // create user
  batch.set(userRef, {
    role: GlobalRole.User,
  });

  await batch.commit();

  // we can set the user as "onboarded" using the custom claims
  // it helps with not having to query Firestore for each request
  await auth.setCustomUserClaims(userId, {
    onboarded: true,
  });
}
