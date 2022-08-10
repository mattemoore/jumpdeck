import { PropsWithChildren } from 'react';
import { RadioGroup } from '@headlessui/react';
import { Trans } from 'next-i18next';

import configuration from '~/configuration';
import If from '~/core/ui/If';
import { Plan } from '~/lib/organizations/types/plan';

export default function PlanSelector(
  props: PropsWithChildren<{
    plan: Maybe<Plan>;
    setPlan: React.Dispatch<React.SetStateAction<Maybe<Plan>>>;
  }>
) {
  const plans = configuration.plans;

  return (
    <RadioGroup value={props.plan} onChange={props.setPlan}>
      <RadioGroup.Label>
        <span className={'text-sm font-semibold'}>
          <Trans i18nKey={'subscription:choosePlan'} />
        </span>
      </RadioGroup.Label>

      <div className="mt-2 w-full space-y-2.5">
        {plans.map((plan) => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            data-cy={`subscription-plan`}
            className={({ active, checked }) =>
              `PlanSelectorRadioItem ${
                active ? '' : 'PlanSelectorRadioItemNonActive'
              }
                  ${checked ? 'PlanSelectorRadioItemChecked' : ''}
                    `
            }
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-full items-center space-x-4">
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
                        className={`inline ${
                          checked ? 'dark:text-gray-300' : 'dark:text-gray-400'
                        }`}
                      >
                        <span>{plan.description}</span>{' '}
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
