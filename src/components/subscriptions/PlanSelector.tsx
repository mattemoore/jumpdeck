import { PropsWithChildren } from 'react';
import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';

import configuration from '~/configuration';
import If from '~/core/ui/If';
import { Plan } from '~/lib/organizations/types/plan';
import PricingTable from '~/components/PricingTable';
import Heading from '~/core/ui/Heading';

const STRIPE_PLANS = configuration.stripe.plans;

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
      <RadioGroup
        className={'w-full lg:w-6/12 2xl:w-4/12'}
        value={props.plan}
        onChange={props.setPlan}
      >
        <div className="w-full space-y-2.5">
          {STRIPE_PLANS.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
              value={plan}
              data-cy={`subscription-plan`}
              className={({ active, checked }) =>
                classNames(`PlanSelectorRadioItem`, {
                  ['PlanSelectorRadioItemNonActive']: !active,
                  ['PlanSelectorRadioItemChecked']: checked,
                })
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex w-full items-center space-x-6">
                      <div className="flex-shrink-0">
                        <If condition={checked} fallback={<UncheckIcon />}>
                          <CheckIcon className="PlanSelectorCheckIcon" />
                        </If>
                      </div>

                      <div className="flex-auto text-sm">
                        <RadioGroup.Label as="p" className={`PlanSelectorName`}>
                          {plan.name}
                        </RadioGroup.Label>

                        <RadioGroup.Description
                          as="span"
                          className={classNames(`inline text-base`, {
                            ['dark:text-gray-300']: checked,
                            ['text-gray-500 dark:text-gray-400']: !checked,
                          })}
                        >
                          {plan.description}
                        </RadioGroup.Description>
                      </div>

                      <span className={'PlanSelectorPrice'}>{plan.price}</span>
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <If condition={props.plan}>
        {(plan) => {
          return (
            <div className={'flex w-full flex-1 flex-col space-y-6'}>
              <div className={'flex flex-col space-y-2'}>
                <Heading type={2}>{plan.name}</Heading>
                <Heading type={4}>{plan.description}</Heading>
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

function CheckIcon(props: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UncheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className={'h-6 w-6'}>
      <circle cx={12} cy={12} r={12} fill="currentColor" opacity="0.2" />;
    </svg>
  );
}
