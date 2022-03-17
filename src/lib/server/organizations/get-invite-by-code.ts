import { getInvitesCollection } from '../collections';
import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

/**
 * @description Fetch an invite by its ID, without having to know the
 * organization it belongs to
 * @param code
 */
export async function getInviteByCode(code: string) {
  const collection = getInvitesCollection();
  const path: keyof MembershipInvite = 'code';
  const op = '==';

  const query = collection.where(path, op, code);
  const ref = await query.get();

  if (ref.size) {
    const document = ref.docs[0];

    return document?.data();
  }
}
