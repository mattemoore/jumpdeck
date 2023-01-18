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
import Alert from '~/core/ui/Alert';
import PricingTable from '~/components/PricingTable';

const SubscriptionCard: React.FC<{
  subscription: OrganizationSubscription;
}> = ({ subscription }) => {
  const details = useSubscriptionDetails(subscription.priceId);
  const endDate = getDateFromSeconds(subscription.periodEndsAt);

  const isSubscriptionActive = useMemo(() => {
    return subscription.status === OrganizationPlanStatus.Paid;
  }, [subscription.status]);

  const isTrialPeriod = useIsTrialPeriod(subscription);

  if (!details) {
    return null;
  }

  return (
    <div className={'flex flex-col space-y-6'} data-cy={'subscription-card'}>
      <div className={'flex flex-col space-y-2'}>
        <div className={'flex items-center space-x-4'}>
          <Heading type={3}>
            <span data-cy={'subscription-name'}>{details.product.name}</span>
          </Heading>

          <If condition={isSubscriptionActive}>
            <Badge size={'small'} color={'success'}>
              <Trans i18nKey={'subscription:subscriptionActiveBadge'} />
            </Badge>
          </If>
        </div>

        <Heading type={6}>
          <span className={'text-gray-500 dark:text-gray-400'}>
            {details.product.description}
          </span>
        </Heading>
      </div>

      <div>
        <span className={'flex items-end'}>
          <PricingTable.Price>{details.plan.price}</PricingTable.Price>

          <span className={'lowercase text-gray-500 dark:text-gray-400'}>
            /{details.plan.name}
          </span>
        </span>
      </div>

      <If condition={isTrialPeriod}>
        <TrialAlert subscription={subscription} />
      </If>

      <div>
        <p>
          <span className={'text-sm'} data-cy={'subscription-period-end'}>
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

function TrialAlert(
  props: React.PropsWithChildren<{
    subscription: OrganizationSubscription;
  }>
) {
  const trialEndsAt = props.subscription.trialEndsAt;

  if (!trialEndsAt) {
    return null;
  }

  return (
    <Alert type={'warn'}>
      <Alert.Heading>
        <Trans
          i18nKey={'subscription:trialAlertHeading'}
          values={{
            endDate: getDateFromSeconds(trialEndsAt),
          }}
        />
      </Alert.Heading>
    </Alert>
  );
}

function getProducts() {
  if (!configuration.production) {
    /**
     * This is read-only, so we also include the testing plans
     * so we can test them.
     *
     * In production, of course, they should never show up
     */
    return [...configuration.stripe.products, ...getTestingProducts()];
  }

  return configuration.stripe.products;
}

/**
 * @name getTestingProducts
 * @description These plans are added for testing-purposes only
 */
function getTestingProducts() {
  return [
    {
      name: 'Testing Plan',
      description: 'Description of your Testing plan',
      features: [],
      plans: [
        {
          price: '$999/year',
          name: 'Yearly',
          stripePriceId: 'price_1LFibmKr5l4rxPx3wWcSO8UY',
        },
      ],
    },
  ];
}

function useSubscriptionDetails(priceId: string) {
  const products = useMemo(() => getProducts(), []);

  return useMemo(() => {
    for (const product of products) {
      for (const plan of product.plans) {
        if (plan.stripePriceId === priceId) {
          return { plan, product };
        }
      }
    }
  }, [products, priceId]);
}

function useIsTrialPeriod(subscription: OrganizationSubscription) {
  return useMemo(() => {
    return (
      subscription.trialEndsAt &&
      subscription.trialEndsAt * 1000 > new Date().getTime()
    );
  }, [subscription.trialEndsAt]);
}

function getDateFromSeconds(seconds: number) {
  const endDateMs = seconds * 1000;

  return new Date(endDateMs).toLocaleDateString();
}

export default SubscriptionCard;
