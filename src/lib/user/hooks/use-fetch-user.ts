import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { UserData } from '~/core/session/types/user-data';
import { useUserId } from '~/core/hooks/use-user-id';
import { USERS_COLLECTION } from '~/lib/firestore-collections';

/**
 * @name useFetchUser
 * @description Fetch the current's user Firestore record.
 *
 * Usage:
 * const { data: user } = useFetchUser();
 *
 * console.log(user);
 *
 * NB: It's best to wrap
 * components that use this component with {@link ErrorBoundary} as userId
 * can become undefined, which will throw a Firestore error
 */
function useFetchUser() {
  const firestore = useFirestore();
  const userId = useUserId() as string;

  const ref = doc(
    firestore,
    USERS_COLLECTION,
    userId
  ) as DocumentReference<UserData>;

  return useFirestoreDocData(ref, { idField: 'id' });
}

export default useFetchUser;
