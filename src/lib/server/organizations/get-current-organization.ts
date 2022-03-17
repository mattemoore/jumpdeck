import { getOrganizationsByUserId } from '~/lib/server/organizations/get-organizations-by-user-id';
import { getOrganizationById } from '../queries';
import { Organization } from '~/lib/organizations/types/organization';

/**
 * @name getCurrentOrganization
 * @description Fetch the selected organization (or the first one in the list)
 */
export async function getCurrentOrganization(
  userId: string,
  organizationId: Maybe<string> = undefined
) {
  return getOrganizationByIdOrFirst(organizationId, userId);
}

async function getOrganizationByIdOrFirst(
  organizationId: Maybe<string>,
  userId: string
) {
  // if the organization ID was passed from the cookie, we try read that
  if (organizationId) {
    const organization = await getOrganizationData(organizationId);

    // check the user ID belongs to the organization members
    const userBelongsToOrganization = userId in (organization?.members ?? {});

    // if the user doesn't have permissions to access
    // the organization, we simply return the first one
    if (userBelongsToOrganization) {
      return organization;
    }
  }

  // if the organization ID was not passed
  // or if somehow the user lacked the permissions
  // we simply return the first organization they belong to
  return getFirstOrganization(userId);
}

/**
 * @name getFirstOrganization
 * @description Get the first organization in the user's record
 */
async function getFirstOrganization(userId: string) {
  try {
    const organizations = await getOrganizationsByUserId(userId).limit(1).get();
    const doc = organizations.docs[0];

    return serializeOrganizationData(doc.data(), doc.id);
  } catch (e) {
    return null;
  }
}

/**
 * @name getOrganizationData
 * @param organizationId
 */
async function getOrganizationData(organizationId: string) {
  const organization = await getOrganizationById(organizationId);
  const data = organization.data();

  return data ? serializeOrganizationData(data, organizationId) : undefined;
}

function serializeOrganizationData(organization: Organization, id: string) {
  const members = Object.keys(organization.members).reduce((acc, userId) => {
    const member = organization.members[userId];

    const item = {
      role: member.role,
      user: member.user.id,
    };

    return {
      ...acc,
      [userId]: item,
    };
  }, {});

  return {
    ...organization,
    members,
    id,
  };
}
