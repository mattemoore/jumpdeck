import { NextApiRequest, NextApiResponse } from 'next';
import type { Stripe } from 'stripe';
import getRawBody from 'raw-body';

import logger from '~/core/logger';
import { getStripeInstance } from '~/core/stripe/get-stripe';
import { StripeWebhooks } from '~/core/stripe/stripe-webhooks.enum';

import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';
import { buildOrganizationSubscription } from '~/lib/stripe/build-organization-subscription';

import {
  deleteOrganizationSubscription,
  activatePendingSubscription,
  setOrganizationSubscription,
  updateSubscriptionById,
} from '~/lib/server/organizations/subscriptions';

import { badRequestException } from '~/core/http-exceptions';

import { withMiddleware } from '~/core/middleware/with-middleware';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withAdmin } from '~/core/middleware/with-admin';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import { withAuthedUser } from '~/core/middleware/with-authed-user';

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

// assert webhook key was provided as an environment variable
validateKeys(webhookSecretKey);

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
async function checkoutsWebhooksHandler(
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
    `Received Stripe Webhook`
  );

  switch (event.type) {
    case StripeWebhooks.Completed: {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

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

    case StripeWebhooks.PaymentFailed: {
      const session = event.data.object as Stripe.Checkout.Session;

      onPaymentFailed(session);

      break;
    }
  }

  return respondOk(res);
}

export default function stripeCheckoutsWebhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withMiddleware(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAdmin,
    checkoutsWebhooksHandler
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

  await setOrganizationSubscription({
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
function onPaymentFailed(session: Stripe.Checkout.Session) {
  console.log(`Payment failed`, session);
}

function respondOk(res: NextApiResponse) {
  res.status(200).send({ success: true });
}

function getOrderStatus(paymentStatus: string) {
  return paymentStatus === 'paid'
    ? OrganizationPlanStatus.Paid
    : OrganizationPlanStatus.AwaitingPayment;
}

function throwKeyNotProvided(variableName: string) {
  throw new Error(
    `Webhooks Secret key not found. Please add the ${variableName} your environment variables`
  );
}

function validateKeys(webhookSecretKey: string) {
  if (!webhookSecretKey) {
    throwKeyNotProvided(`STRIPE_WEBHOOK_SECRET`);
  }
}
