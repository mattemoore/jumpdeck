import React from 'react';
import { Trans } from 'next-i18next';

import { OrganizationSubscription } from '~/lib/organizations/types/organization-subscription';
import Heading from '~/core/ui/Heading';
import configuration from '~/configuration';

const SubscriptionCard: React.FCC<{
  subscription: OrganizationSubscription;
}> = ({ subscription }) => {
  const plan = configuration.plans.find((item) => {
    return item.stripePriceId === subscription.priceId;
  });

  if (!plan) {
    return null;
  }

  const endDate = new Date(
    subscription.periodEndsAt * 1000
  ).toLocaleDateString();

  return (
    <div className={'flex flex-col space-y-4'}>
      <div>
        <span className={'text-xs text-gray-700 dark:text-gray-400'}>
          <Trans i18nKey={'subscription:currentPlan'} />
        </span>

        <Heading type={2}>{plan.name}</Heading>

        <Heading type={6}>
          <span className={'text-gray-700 dark:text-gray-400'}>
            {plan.description}
          </span>
        </Heading>
      </div>

      <div className={'my-4'}>
        <p className={'text-sm'}>
          <Trans
            i18nKey={'subscription:subscriptionWillEndOn'}
            values={{ endDate }}
          />
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
