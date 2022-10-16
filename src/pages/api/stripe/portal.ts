import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { join } from 'path';

import logger from '~/core/logger';
import configuration from '~/configuration';
import { HttpStatusCode } from '~/core/generic';
import withCsrf from '~/core/middleware/with-csrf';

import { createBillingPortalSession } from '~/lib/stripe/create-billing-portal-session';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { canChangeBilling } from '~/lib/organizations/permissions';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { getApiRefererPath } from '~/core/generic/get-api-referer-path';
import { getUserRoleByOrganization } from '~/lib/server/organizations/memberships';
import { getOrganizationByCustomerId } from '~/lib/server/organizations/subscriptions';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

async function billingPortalRedirectHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firebaseUser, headers } = req;
  const referrerPath = getApiRefererPath(headers);
  const userId = firebaseUser.uid;

  const schemaResult = getBodySchema().safeParse(req.body);

  const redirectToErrorPage = () => {
    const url = join(referrerPath, `?error=true`);

    return res.redirect(url);
  };

  if (!schemaResult.success) {
    return redirectToErrorPage();
  }

  const { customerId } = schemaResult.data;

  // we check that the user is authorized to access the portal
  const canAccess = await getUserCanAccessCustomerPortal({
    customerId,
    userId,
  });

  if (!canAccess) {
    return redirectToErrorPage();
  }

  try {
    const headers = req.headers;
    const returnUrl =
      headers.referer || headers.origin || configuration.paths.appHome;

    const { url } = await createBillingPortalSession({
      returnUrl,
      customerId,
    });

    res.redirect(HttpStatusCode.MovedPermanently, url);
  } catch (e) {
    logger.error(e, `Stripe Billing Portal redirect error`);

    return redirectToErrorPage();
  }
}

export default function stripePortalHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return withPipe(
    withCsrf((req) => req.body.csrfToken),
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    billingPortalRedirectHandler
  )(req, res);
}

/**
 * @name getUserCanAccessCustomerPortal
 * @description Returns whether a user {@link userId} has access to the
 * Stripe portal of an organization with customer ID {@link customerId}
 */
async function getUserCanAccessCustomerPortal(params: {
  customerId: string;
  userId: string;
}) {
  try {
    const organization = await getOrganizationByCustomerId(params.customerId);

    const userRole = await getUserRoleByOrganization({
      organizationId: organization.id,
      userId: params.userId,
    });

    if (userRole === undefined) {
      return false;
    }

    return canChangeBilling(userRole);
  } catch (e) {
    logger.error(e, `Could not retrieve user role`);

    return false;
  }
}

function getBodySchema() {
  return z.object({
    customerId: z.string(),
  });
}
