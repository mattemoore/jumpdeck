import type { Stripe } from 'stripe';

import {
  OrganizationSubscription,
  OrganizationPlanStatus,
} from '~/lib/organizations/types/organization-subscription';

export function buildOrganizationSubscription(
  subscription: Stripe.Subscription,
  status: OrganizationPlanStatus = OrganizationPlanStatus.Paid
): OrganizationSubscription {
  const lineItem = subscription.items.data[0];
  const plan = lineItem.plan;

  return {
    id: subscription.id,
    priceId: plan?.id,
    status,
    currency: lineItem.price.currency ?? null,
    interval: plan?.interval ?? null,
    intervalCount: plan?.interval_count ?? null,
    createdAt: subscription.created,
    periodStartsAt: subscription.current_period_start,
    periodEndsAt: subscription.current_period_end,
    trialStartsAt: subscription.trial_start ?? null,
    trialEndsAt: subscription.trial_end ?? null,
  };
}
