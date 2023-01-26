import type { Stripe } from 'stripe';

import { OrganizationSubscription } from '~/lib/organizations/types/organization-subscription';

export function buildOrganizationSubscription(
  subscription: Stripe.Subscription
): OrganizationSubscription {
  const lineItem = subscription.items.data[0];
  const price = lineItem.price;

  return {
    id: subscription.id,
    priceId: price?.id,
    status: subscription.status,
    currency: lineItem.price.currency ?? null,
    interval: price?.recurring?.interval ?? null,
    intervalCount: price?.recurring?.interval_count ?? null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    createdAt: subscription.created,
    periodStartsAt: subscription.current_period_start,
    periodEndsAt: subscription.current_period_end,
    trialStartsAt: subscription.trial_start ?? null,
    trialEndsAt: subscription.trial_end ?? null,
  };
}
