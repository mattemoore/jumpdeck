import { useFirestore } from 'reactfire';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback } from 'react';

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
  return ['organizations', organizationId, 'invites', inviteId].join('/');
}
