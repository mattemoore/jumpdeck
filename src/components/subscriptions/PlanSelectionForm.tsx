import React, { useState } from 'react';
import { Trans } from 'next-i18next';

import configuration from '~/configuration';

import PlanSelector from '~/components/subscriptions/PlanSelector';
import CheckoutRedirectButton from '~/components/subscriptions/CheckoutRedirectButton';
import BillingPortalRedirectButton from '~/components/subscriptions/BillingRedirectButton';

import { Organization } from '~/lib/organizations/types/organization';
import { Plan } from '~/lib/organizations/types/plan';

import { IfHasPermissions } from '~/components/IfHasPermissions';
import { canChangeBilling } from '~/lib/organizations/permissions';

import If from '~/core/ui/If';

const PlanSelectionForm: React.FCC<{
  organization: WithId<Organization>;
}> = ({ organization }) => {
  const initialPlan = configuration.plans.find((item) => {
    return item.stripePriceId === organization?.subscription?.priceId;
  });

  const [selectedPlan, setSelectedPlan] = useState<Maybe<Plan>>(initialPlan);

  const isCheckoutDisabled =
    initialPlan?.stripePriceId === selectedPlan?.stripePriceId;

  const customerId = organization.customerId;

  return (
    <>
      <div>
        <p>
          <Trans i18nKey={'subscription:notSubscribedToAnyPlan'} />
        </p>
      </div>

      <div className={'flex flex-col space-y-4'}>
        <IfHasPermissions condition={canChangeBilling}>
          <div className={'w-full lg:w-8/12 xl:w-6/12'}>
            <PlanSelector plan={selectedPlan} setPlan={setSelectedPlan} />
          </div>

          <div className={'flex flex-row space-x-4'}>
            <CheckoutRedirectButton
              organizationId={organization.id}
              priceId={selectedPlan?.stripePriceId}
              customerId={customerId}
              disabled={isCheckoutDisabled}
            >
              <Trans i18nKey={'subscription:goToCheckout'} />
            </CheckoutRedirectButton>

            <If condition={customerId}>
              <BillingPortalRedirectButton customerId={customerId as string}>
                <Trans i18nKey={'subscription:manageBilling'} />
              </BillingPortalRedirectButton>
            </If>
          </div>
        </IfHasPermissions>
      </div>
    </>
  );
};

export default PlanSelectionForm;
