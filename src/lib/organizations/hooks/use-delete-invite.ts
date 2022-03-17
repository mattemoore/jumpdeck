import { useFirestore } from 'reactfire';
import { deleteDoc, doc } from 'firebase/firestore';

export function useDeleteInvite() {
  const firestore = useFirestore();

  return function deleteInviteRequest(
    organizationId: string,
    inviteId: string
  ) {
    const path = getPath(organizationId, inviteId);
    const docRef = doc(firestore, path);

    return deleteDoc(docRef);
  };
}

function getPath(organizationId: string, inviteId: string) {
  return ['organizations', organizationId, 'invites', inviteId].join('/');
}
