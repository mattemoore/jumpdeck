import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { join } from 'path';

import logger from '~/core/logger';
import { HttpStatusCode } from '~/core/generic';
import { createStripeCheckout } from '~/lib/stripe/create-checkout';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { getUserRoleByOrganization } from '~/lib/server/organizations/get-user-role-by-organization';
import { canChangeBilling } from '~/lib/organizations/permissions';

import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { getApiRefererPath } from '~/core/generic/get-api-referer-path';
import configuration from '~/configuration';

const SUPPORTED_METHODS: HttpMethod[] = ['POST'];

async function checkoutsSessionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { headers, firebaseUser } = req;

  const referer = getApiRefererPath(headers);
  const bodyResult = getBodySchema().safeParse(req.body);

  const userId = firebaseUser.uid;

  const redirectToErrorPage = () => {
    const url = join(referer, `?error=true`);

    return res.redirect(HttpStatusCode.SeeOther, url);
  };

  if (!bodyResult.success) {
    return redirectToErrorPage();
  }

  const { organizationId, priceId, customerId } = bodyResult.data;

  const canChangeBilling = await getUserCanAccessCheckout({
    organizationId,
    userId,
  });

  // disallow if the user doesn't have permissions to change
  // billing settings based on its role. To change the logic, please update
  // {@link canChangeBilling}
  if (!canChangeBilling) {
    logger.debug(
      {
        userId,
        organizationId,
      },
      `User attempted to access checkout, but lacked permissions`
    );

    return redirectToErrorPage();
  }

  try {
    const returnUrl =
      req.headers.referer || req.headers.origin || configuration.paths.appHome;

    const { url } = await createStripeCheckout({
      returnUrl,
      organizationId,
      priceId,
      customerId,
    });

    // redirect user back based on the response
    res.redirect(HttpStatusCode.SeeOther, url as string);
  } catch (e) {
    logger.error(e, `Stripe Checkout error`);

    return redirectToErrorPage();
  }
}

export default function stripeCheckoutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return withMiddleware(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    checkoutsSessionHandler
  )(req, res);
}

async function getUserCanAccessCheckout(params: {
  organizationId: string;
  userId: string;
}) {
  try {
    const userRole = await getUserRoleByOrganization(params);

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
    organizationId: z.string(),
    priceId: z.string(),
    customerId: z.string().optional(),
  });
}
