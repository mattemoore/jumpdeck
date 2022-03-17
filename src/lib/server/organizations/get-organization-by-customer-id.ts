import { getOrganizationsCollection } from '~/lib/server/collections';

/**
 * @description Retrieve an organization using the customer ID assigned by
 * Stripe after the first check out, eg. when the customer record is created
 * @param customerId
 */
export async function getOrganizationByCustomerId(customerId: string) {
  const organizations = getOrganizationsCollection();
  const path = `customerId`;
  const op = '==';

  const result = await organizations.where(path, op, customerId).get();

  return result.docs[0];
}
