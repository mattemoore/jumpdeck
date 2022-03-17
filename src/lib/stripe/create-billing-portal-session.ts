import { getStripeInstance } from '~/core/stripe/get-stripe';

/**
 * @name createBillingPortalSession
 * @param params
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = await getStripeInstance();

  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}
