import React from 'react';
import { Trans } from 'next-i18next';

import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

import PlanSelectionForm from '~/components/subscriptions/PlanSelectionForm';
import BillingPortalRedirectButton from '~/components/subscriptions/BillingRedirectButton';

import If from '~/core/ui/If';
import SubscriptionCard from './SubscriptionCard';

import { canChangeBilling } from '~/lib/organizations/permissions';
import { IfHasPermissions } from '~/components/IfHasPermissions';

const Plans: React.FC = () => {
  const organization = useCurrentOrganization();

  if (!organization) {
    return null;
  }

  const customerId = organization.customerId;

  return (
    <If
      condition={organization.subscription}
      fallback={<PlanSelectionForm organization={organization} />}
    >
      {(subscription) => (
        <div className={'flex flex-col space-y-4'}>
          <SubscriptionCard subscription={subscription} />

          <IfHasPermissions condition={canChangeBilling}>
            <If condition={customerId}>
              <BillingPortalRedirectButton customerId={customerId as string}>
                <Trans i18nKey={'subscription:manageBilling'} />
              </BillingPortalRedirectButton>
            </If>
          </IfHasPermissions>
        </div>
      )}
    </If>
  );
};

export default Plans;
