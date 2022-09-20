import { useFirestore } from 'reactfire';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback } from 'react';

import {
  INVITES_COLLECTION,
  ORGANIZATIONS_COLLECTION,
} from '~/lib/firestore-collections';

export function useDeleteInvite() {
  const firestore = useFirestore();

  return useCallback(
    (organizationId: string, inviteId: string) => {
      const path = getDeleteInvitePath(organizationId, inviteId);
      const docRef = doc(firestore, path);

      return deleteDoc(docRef);
    },
    [firestore]
  );
}

/**
 * @name getDeleteInvitePath
 * @param organizationId
 * @param inviteId
 * @description Builds path to the API to delete
 * an invite: /api/organizations/{ORGANIZATION_ID}/invites/{INVITE_ID}
 */
function getDeleteInvitePath(organizationId: string, inviteId: string) {
  return [
    ORGANIZATIONS_COLLECTION,
    organizationId,
    INVITES_COLLECTION,
    inviteId,
  ].join('/');
}
