import React from 'react';
import { Trans } from 'next-i18next';

import {
  OrganizationPlanStatus,
  OrganizationSubscription,
} from '~/lib/organizations/types/organization-subscription';

import Heading from '~/core/ui/Heading';
import configuration from '~/configuration';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

const SubscriptionCard: React.FCC<{
  subscription: OrganizationSubscription;
}> = ({ subscription }) => {
  const plans = getPlans();

  const plan = plans.find((item) => {
    return item.stripePriceId === subscription.priceId;
  });

  if (!plan) {
    return null;
  }

  const endDateMs = subscription.periodEndsAt * 1000;
  const endDate = new Date(endDateMs).toUTCString();

  const isAwaitingPayment =
    subscription.status === OrganizationPlanStatus.AwaitingPayment;

  return (
    <div className={'flex flex-col space-y-4'} data-cy={'subscription-card'}>
      <If condition={isAwaitingPayment}>
        <AwaitingPaymentAlert />
      </If>

      <div>
        <span className={'text-xs text-gray-700 dark:text-gray-400'}>
          <Trans i18nKey={'subscription:currentPlan'} />
        </span>

        <Heading type={2}>
          <span data-cy={'subscription-name'}>{plan.name}</span>
        </Heading>

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

function AwaitingPaymentAlert() {
  return (
    <Alert type={'warn'}>
      <span data-cy={'awaiting-payment-alert'}>
        <Trans i18nKey={'subscription:awaitingPaymentAlert'} />
      </span>
    </Alert>
  );
}

function getPlans() {
  /**
   * This is read-only, so we also include the testing plans
   * so we can test them.
   *
   * In production, of course, they should never show up
   */
  return [...configuration.plans, ...configuration.testingPlans];
}

export default SubscriptionCard;
