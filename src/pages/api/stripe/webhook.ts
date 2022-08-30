import { NextApiRequest, NextApiResponse } from 'next';
import type { Stripe } from 'stripe';
import getRawBody from 'raw-body';

import logger from '~/core/logger';
import { getStripeInstance } from '~/core/stripe/get-stripe';
import { StripeWebhooks } from '~/core/stripe/stripe-webhooks.enum';

import {
  badRequestException,
  internalServerErrorException,
} from '~/core/http-exceptions';

import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { getUserInfoById } from '~/core/firebase/admin/auth/get-user-info-by-id';
import { withAdmin } from '~/core/middleware/with-admin';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import { sendEmail } from '~/core/email/send-email';

import {
  activatePendingSubscription,
  deleteOrganizationSubscription,
  setOrganizationSubscription,
  updateSubscriptionById,
} from '~/lib/server/organizations/subscriptions';

import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';
import { buildOrganizationSubscription } from '~/lib/stripe/build-organization-subscription';

import { getOrganizationById } from '~/lib/server/queries';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import renderPaymentFailed from '~/lib/emails/payment-failed';

import configuration from '~/configuration';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];
const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

// NB: we disable body parser to receive the raw body string. The raw body
// is fundamental to verify that the request is genuine
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string;

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
async function checkoutWebhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers[STRIPE_SIGNATURE_HEADER];

  // verify signature header is not missing
  if (!signature) {
    return badRequestException(res);
  }

  const rawBody = await getRawBody(req);
  const stripe = await getStripeInstance();

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecretKey
  );

  logger.info(
    {
      type: event.type,
    },
    `[Stripe] Received Stripe Webhook`
  );

  try {
    switch (event.type) {
      case StripeWebhooks.Completed: {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await onCheckoutCompleted(session, subscription);

        break;
      }

      case StripeWebhooks.AsyncPaymentSuccess: {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.client_reference_id as string;

        await activatePendingSubscription(organizationId);

        break;
      }

      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;

        await deleteOrganizationSubscription(subscription.id);

        break;
      }

      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;

        await onSubscriptionUpdated(subscription);

        break;
      }

      case StripeWebhooks.AsyncPaymentFailed: {
        const session = event.data.object as Stripe.Checkout.Session;

        // when the payment fails
        // we send an email to the customer to redirect them to the
        // billing page
        await onAsyncPaymentFailed(session);

        break;
      }
    }

    return respondOk(res);
  } catch (e) {
    logger.error(
      {
        type: event.type,
      },
      `[Stripe] Webhook handling failed`
    );

    logger.debug(e);

    return internalServerErrorException(res);
  }
}

export default function stripeCheckoutsWebhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withMiddleware(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAdmin,
    checkoutWebhooksHandler
  );

  return withExceptionFilter(req, res)(handler);
}

/**
 * @description When the checkout is completed, we store the order. The
 * subscription is only activated if the order was paid successfully.
 * Otherwise, we have to wait for a further webhook
 */
async function onCheckoutCompleted(
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
) {
  const organizationId = session.client_reference_id as string;
  const customerId = session.customer as string;
  const status = getOrderStatus(session.payment_status);

  // build organization subscription and set on the organization document
  // we add just enough data in the DB, so we do not query
  // Stripe for every bit of data
  // if you need your DB record to contain further data
  // add it to {@link buildOrganizationSubscription}
  const subscriptionData = buildOrganizationSubscription(subscription, status);

  return setOrganizationSubscription({
    organizationId,
    customerId,
    subscription: subscriptionData,
  });
}

async function onSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = buildOrganizationSubscription(subscription);

  await updateSubscriptionById(subscription.id, subscriptionData);
}

/**
 * @description When the payment failed, notify the customer by email
 */
async function onAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  const organizationId = session.client_reference_id;
  const subscription = session.subscription;

  const subscriptionId =
    subscription && typeof subscription !== 'string'
      ? subscription.id
      : subscription;

  logger.info(
    {
      organizationId: organizationId,
      subscriptionId: subscriptionId,
    },
    `Payment failed. Sending email to customer...`
  );

  let customerEmail: string | null = session.customer_email;

  if (!organizationId) {
    logger.error(
      {
        subscriptionId,
      },
      `No organization attached to subscription`
    );

    throw new Error(`No organization attached to subscription`);
  }

  const organization = await getOrganizationById(organizationId);
  const organizationData = organization.data();

  if (!organizationData) {
    logger.error(
      {
        organizationId,
        subscriptionId,
      },
      `Organization was not found`
    );

    throw new Error(`No organization data found for subscription`);
  }

  if (!customerEmail) {
    logger.warn(
      {
        organizationId,
        subscriptionId,
      },
      `Customer email was not found in Stripe. Attempting to retrieve email of the organization's owner...`
    );

    const owner = Object.values(organizationData.members).find(
      (member) => member.role === MembershipRole.Owner
    );

    if (owner) {
      const ownerProfile = await getUserInfoById(owner.user.id);
      customerEmail = ownerProfile?.email ?? null;
    }
  }

  if (!customerEmail) {
    logger.fatal(
      {
        organizationId,
        subscriptionId,
      },
      `Unable to locate any customer email. Resolve issue manually.`
    );

    throw new Error(
      `Unable to locate a valid customer email for organization with ID ${organizationId}`
    );
  }

  const redirectUrl = [
    configuration.site.siteUrl,
    `settings/subscription`,
  ].join('/');

  const { html, errors } = renderPaymentFailed({
    organizationName: organizationData.name,
    value: session.amount_total,
    productName: configuration.site.siteName,
    redirectUrl,
  });

  if (errors.length) {
    throw new Error(
      `Found errors while rendering failed payment email: ${JSON.stringify(
        errors,
        null,
        2
      )}`
    );
  }

  const subject = `Your payment did not go through`;
  const sender = configuration.email.senderAddress;

  return sendEmail({
    to: customerEmail,
    from: sender,
    subject,
    html,
  });
}

function respondOk(res: NextApiResponse) {
  res.status(200).send({ success: true });
}

function getOrderStatus(paymentStatus: string) {
  const isPaid = paymentStatus === 'paid';

  return isPaid
    ? OrganizationPlanStatus.Paid
    : OrganizationPlanStatus.AwaitingPayment;
}
