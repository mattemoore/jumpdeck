import React, { useMemo } from 'react';
import { Trans } from 'next-i18next';

import {
  OrganizationPlanStatus,
  OrganizationSubscription,
} from '~/lib/organizations/types/organization-subscription';

import Heading from '~/core/ui/Heading';
import Badge from '~/core/ui/Badge';

import configuration from '~/configuration';
import If from '~/core/ui/If';

const SubscriptionCard: React.FC<{
  subscription: OrganizationSubscription;
}> = ({ subscription }) => {
  const plans = useMemo(() => getPlans(), []);

  const plan = useMemo(() => {
    return plans.find((item) => {
      return item.stripePriceId === subscription.priceId;
    });
  }, [plans, subscription.priceId]);

  const endDate = useMemo(() => {
    const endDateMs = subscription.periodEndsAt * 1000;

    return new Date(endDateMs).toLocaleDateString();
  }, [subscription.periodEndsAt]);

  const isSubscriptionActive = useMemo(() => {
    return subscription.status === OrganizationPlanStatus.Paid;
  }, [subscription.status]);

  if (!plan) {
    return null;
  }

  return (
    <div className={'flex flex-col space-y-6'} data-cy={'subscription-card'}>
      <div className={'flex flex-col space-y-2.5'}>
        <span className={'text-xs text-gray-700 dark:text-gray-400'}>
          <Trans i18nKey={'subscription:currentPlan'} />
        </span>

        <div className={'flex items-center space-x-4'}>
          <Heading type={3}>
            <span data-cy={'subscription-name'}>{plan.name}</span>
          </Heading>

          <If condition={isSubscriptionActive}>
            <Badge size={'small'} color={'success'}>
              <Trans i18nKey={'subscription:subscriptionActiveBadge'} />
            </Badge>
          </If>
        </div>

        <Heading type={6}>
          <span className={'text-gray-700 dark:text-gray-400'}>
            {plan.description}
          </span>
        </Heading>
      </div>

      <div className={'my-4'}>
        <p>
          <span data-cy={'subscription-period-end'}>
            <Trans
              i18nKey={'subscription:subscriptionWillEndOn'}
              values={{ endDate }}
            />
          </span>
        </p>
      </div>
    </div>
  );
};

function getPlans() {
  const { plans } = configuration.stripe;

  /**
   * This is read-only, so we also include the testing plans
   * so we can test them.
   *
   * In production, of course, they should never show up
   */
  return [...plans, ...getTestingPlans()];
}

/**
 * @name getTestingPlans
 * @description These plans are added for testing-purposes only
 */
function getTestingPlans() {
  return [
    {
      name: 'Testing Plan',
      description: 'Description of your Testing plan',
      price: '$999/year',
      stripePriceId: 'price_1LFibmKr5l4rxPx3wWcSO8UY',
      features: [],
    },
  ];
}

export default SubscriptionCard;
