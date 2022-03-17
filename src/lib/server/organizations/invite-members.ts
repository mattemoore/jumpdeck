import { addDays } from 'date-fns';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { canInviteUser } from '~/lib/organizations/permissions';

import { sendEmail } from '~/core/email/send-email';
import configuration from '~/configuration';

import { getOrganizationById } from '../queries';
import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

interface Invite {
  email: string;
  role: MembershipRole;
}

interface Params {
  organizationId: string;
  inviterId: string;
  invites: Invite[];
}

// change this constant to set a different amount of days
// for the invite to expire
const INVITE_EXPIRATION_DAYS = 7;

export async function inviteMembers(params: Params) {
  const { organizationId, invites, inviterId } = params;

  const organization = await getOrganizationById(organizationId);
  const organizationData = organization.data();
  const inviterRole = organizationData?.members[inviterId].role;

  // validate that the inviter is currently in the organization
  if (inviterRole === undefined) {
    throw new Error(
      `Invitee with ID ${inviterId} does not belong to the organization`
    );
  }

  const invitesCollection = organization.ref.collection(`invites`);
  const requests: Array<Promise<unknown>> = [];

  const expiresAt = addDays(new Date(), INVITE_EXPIRATION_DAYS).getTime();

  for (const invite of invites) {
    const ref = invitesCollection.doc();

    // validate that the user has permissions
    // to invite the user based on their roles
    if (!canInviteUser(inviterRole, invite.role)) {
      return;
    }

    const emailRequest = () => sendInviteEmail(invite.email, ref.id);

    const field: keyof MembershipInvite = 'email';
    const op = '==';

    const existingInvite = await invitesCollection
      .where(field, op, invite.email)
      .get();

    const inviteExists = !existingInvite.empty;

    // if an invite to the email {invite.email} already exists,
    // then we update the existing document
    if (inviteExists) {
      const doc = existingInvite.docs[0];

      const request = async () => {
        await doc.ref.update({ ...invite });
        await emailRequest();
      };

      requests.push(request());
    } else {
      // otherwise, we create a new document with the invite

      const request = async () => {
        const data: MembershipInvite = {
          ...invite,
          code: ref.id,
          expiresAt,
          organization: {
            id: organizationId,
            name: organizationData?.name ?? '',
          },
        };

        await invitesCollection.add(data);
        await emailRequest();
      };

      requests.push(request());
    }
  }

  return Promise.all(requests);
}

function sendInviteEmail(email: string, inviteCode: string) {
  const siteUrl = configuration.site.siteUrl;

  assertSiteUrl(siteUrl);

  const link = `${siteUrl}/auth/invite/${inviteCode}`;

  return sendEmail({
    to: email,
    from: 'me@me.com',
    subject: 'You have been invited to join an organization!',
    text: `Hi! You have been invited to join an organization. Join by signing up using the <a href='${link}'>following link</a>`,
  });
}

function assertSiteUrl(siteUrl: Maybe<string>): asserts siteUrl is string {
  if (!siteUrl) {
    throw new Error(
      `Please configure the "siteUrl" property in the configuration file ~/configuration.ts`
    );
  }
}
