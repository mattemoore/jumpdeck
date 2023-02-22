import { addDays } from 'date-fns';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { canInviteUser } from '~/lib/organizations/permissions';
import renderInviteEmail from '~/lib/emails/invite';
import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

import { sendEmail } from '~/core/email/send-email';
import configuration from '~/configuration';
import { getUserInfoById } from '~/core/firebase/admin/auth/get-user-info-by-id';

import { getOrganizationById } from '../queries';
import logger from '~/core/logger';

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

  const inviter = await getUserInfoById(inviterId);
  const organization = await getOrganizationById(organizationId);
  const organizationData = organization.data();

  if (!organizationData) {
    throw new Error(
      `Organization data with ID ${organizationId} was not found`
    );
  }

  const organizationName = organizationData.name;
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

    const inviterDisplayName =
      inviter?.displayName ?? inviter?.email ?? undefined;

    const organizationLogo = organizationData?.logoURL ?? undefined;

    const sendEmailRequest = () =>
      sendInviteEmail({
        invitedUserEmail: invite.email,
        inviteCode: ref.id,
        organizationName,
        organizationLogo,
        inviter: inviterDisplayName,
      });

    const field: keyof MembershipInvite = 'email';
    const op = '==';

    const existingInvite = await invitesCollection
      .where(field, op, invite.email)
      .get();

    const inviteExists = !existingInvite.empty;

    // this callback will be called when the promise fails
    const catchCallback = (error: unknown) => {
      logger.error(
        {
          inviteId: ref.id,
          inviter: inviter?.uid,
          organizationId,
        },
        `Error while sending invite to member`
      );

      logger.debug(error);

      return Promise.reject(error);
    };

    // if an invitation to the email {invite.email} already exists,
    // then we update the existing document
    if (inviteExists) {
      const doc = existingInvite.docs[0];

      const request = async () => {
        try {
          // update invitation document
          await doc.ref.update({ ...invite });

          // send email
          await sendEmailRequest();
        } catch (e) {
          return catchCallback(e);
        }
      };

      // add a promise for each invite
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

        try {
          // add invite to the Firestore collection
          await invitesCollection.add(data);

          // send email to user
          await sendEmailRequest();
        } catch (e) {
          return catchCallback(e);
        }
      };

      // add a promise for each invite
      requests.push(request());
    }
  }

  return Promise.all(requests);
}

function sendInviteEmail(props: {
  invitedUserEmail: string;
  inviteCode: string;
  organizationName: string;
  organizationLogo: Maybe<string>;
  inviter: Maybe<string>;
}) {
  const {
    invitedUserEmail,
    inviteCode,
    organizationName,
    organizationLogo,
    inviter,
  } = props;

  const sender = configuration.email.senderAddress;
  const productName = configuration.site.siteName;

  const subject = 'You have been invited to join an organization!';
  const link = getInvitePageFullUrl(inviteCode);

  const html = renderInviteEmail({
    productName,
    link,
    organizationName,
    organizationLogo,
    invitedUserEmail,
    inviter,
  });

  return sendEmail({
    to: invitedUserEmail,
    from: sender,
    subject,
    html,
  });
}

/**
 * @name getInvitePageFullUrl
 * @description Return the full URL to the invite page link. For example,
 * makerkit.dev/auth/invite/{INVITE_CODE}
 * @param inviteCode
 */
function getInvitePageFullUrl(inviteCode: string) {
  let siteUrl = configuration.site.siteUrl;

  if (configuration.emulator) {
    siteUrl = getEmulatorHost();
  }

  assertSiteUrl(siteUrl);

  return [siteUrl, 'auth', 'invite', inviteCode].join('/');
}

function assertSiteUrl(siteUrl: Maybe<string>): asserts siteUrl is string {
  if (!siteUrl && configuration.production) {
    throw new Error(
      `Please configure the "siteUrl" property in the configuration file ~/configuration.ts`
    );
  }
}

function getEmulatorHost() {
  const host = `http://localhost`;
  const port = 3000;

  return [host, port].join(':');
}
