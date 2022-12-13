import { PropsWithChildren } from 'react';

import configuration from '~/configuration';
import If from '~/core/ui/If';
import RadioGroup from '~/core/ui/RadioGroup';
import { Plan } from '~/lib/organizations/types/plan';
import PricingTable from '~/components/PricingTable';
import Heading from '~/core/ui/Heading';

const STRIPE_PLANS = configuration.stripe.plans.map((item) => {
  return {
    ...item,
    label: item.name,
  };
});

export default function PlanSelector(
  props: PropsWithChildren<{
    plan: Maybe<Plan>;
    setPlan: React.Dispatch<React.SetStateAction<Maybe<Plan>>>;
  }>
) {
  return (
    <div
      className={
        'flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12'
      }
    >
      <RadioGroup<Plan>
        className={'w-full lg:w-8/12 xl:w-6/12 2xl:w-5/12'}
        value={props.plan}
        setValue={props.setPlan}
      >
        {STRIPE_PLANS.map((plan) => (
          <RadioGroup.Option
            key={plan.name}
            item={plan}
            data-cy={`subscription-plan`}
          >
            <span className={'text-base font-semibold dark:text-white'}>
              {plan.price}
            </span>
          </RadioGroup.Option>
        ))}
      </RadioGroup>

      <If condition={props.plan}>
        {(plan) => {
          return (
            <div className={'flex w-full flex-1 flex-col space-y-4'}>
              <div className={'flex flex-col space-y-2'}>
                <Heading type={4}>{plan.name}</Heading>

                <Heading type={6}>
                  <span className={'text-gray-500 dark:text-gray-400'}>
                    {plan.description}
                  </span>
                </Heading>
              </div>

              <PricingTable.Price>{plan.price}</PricingTable.Price>

              <PricingTable.FeaturesList features={plan.features} />
            </div>
          );
        }}
      </If>
    </div>
  );
}
