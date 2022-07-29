import { CollectionReference, getFirestore } from 'firebase-admin/firestore';

import { Organization } from '~/lib/organizations/types/organization';
import { UserData } from '~/core/session/types/user-data';

enum FirestoreCollections {
  Users = 'users',
  Organizations = 'organizations',
  Invites = 'invites',
}

export function getUsersCollection() {
  return getCollectionByName(
    FirestoreCollections.Users
  ) as CollectionReference<UserData>;
}

export function getOrganizationsCollection() {
  return getCollectionByName(
    FirestoreCollections.Organizations
  ) as CollectionReference<Organization>;
}

export function getInvitesCollection() {
  return getCollectionGroupByName(FirestoreCollections.Invites);
}

function getCollectionByName(collection: FirestoreCollections) {
  return getFirestore().collection(collection);
}

function getCollectionGroupByName(collection: FirestoreCollections) {
  return getFirestore().collectionGroup(collection);
}
