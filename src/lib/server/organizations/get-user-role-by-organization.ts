import { getOrganizationById } from '~/lib/server/queries';

/**
 * @description Get the role of a user given an organization ID
 * @param params
 */
export async function getUserRoleByOrganization(params: {
  userId: string;
  organizationId: string;
}) {
  const ref = await getOrganizationById(params.organizationId);
  const data = ref.data();

  return data?.members[params.userId]?.role;
}
