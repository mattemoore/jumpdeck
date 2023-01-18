import React from 'react';
import { Trans } from 'next-i18next';

import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

import PlanSelectionForm from '~/components/subscriptions/PlanSelectionForm';
import BillingPortalRedirectButton from '~/components/subscriptions/BillingRedirectButton';

import If from '~/core/ui/If';
import SubscriptionCard from './SubscriptionCard';
import Alert from '~/core/ui/Alert';

import { canChangeBilling } from '~/lib/organizations/permissions';
import { IfHasPermissions } from '~/components/IfHasPermissions';
import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';

const Plans: React.FC = () => {
  const organization = useCurrentOrganization();

  if (!organization) {
    return null;
  }

  const customerId = organization.customerId;
  const subscription = organization.subscription;

  if (!subscription) {
    return <PlanSelectionForm organization={organization} />;
  }

  const isAwaitingPayment =
    subscription.status === OrganizationPlanStatus.AwaitingPayment;

  return (
    <div className={'flex flex-col space-y-4'}>
      <If condition={isAwaitingPayment}>
        <AwaitingPaymentAlert />
      </If>

      <SubscriptionCard subscription={subscription} />

      <IfHasPermissions condition={canChangeBilling}>
        <If condition={customerId}>
          <div className={'flex flex-col space-y-2'}>
            <BillingPortalRedirectButton customerId={customerId as string}>
              <Trans i18nKey={'subscription:manageBilling'} />
            </BillingPortalRedirectButton>

            <span className={'text-xs text-gray-500 dark:text-gray-400'}>
              <Trans i18nKey={'subscription:manageBillingDescription'} />
            </span>
          </div>
        </If>
      </IfHasPermissions>
    </div>
  );
};

function AwaitingPaymentAlert() {
  return (
    <Alert type={'warn'}>
      <Alert.Heading>
        <Trans i18nKey={'subscription:awaitingPaymentAlertHeading'} />
      </Alert.Heading>

      <span data-cy={'awaiting-payment-alert'}>
        <Trans i18nKey={'subscription:awaitingPaymentAlert'} />
      </span>
    </Alert>
  );
}

export default Plans;
