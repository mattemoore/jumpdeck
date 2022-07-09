import { PropsWithChildren } from 'react';
import { RadioGroup } from '@headlessui/react';

import configuration from '~/configuration';

import If from '~/core/ui/If';
import { Plan } from '~/lib/organizations/types/plan';
import { Trans } from 'next-i18next';

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
            className={({ active, checked }) =>
              `${
                active
                  ? ''
                  : 'hover:bg-gray-50 dark:bg-black-300' +
                    ' dark:hover:bg-black-400' +
                    ' dark:active:bg-black-500' +
                    ' transition-colors'
              }
                  ${
                    checked
                      ? 'bg-gray-100 ring-2 dark:bg-black-400' +
                        ' ring-primary-400 '
                      : ''
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-full items-center space-x-4">
                    <div className="flex-shrink-0">
                      <If condition={checked} fallback={<UncheckIcon />}>
                        <CheckIcon className="h-6 w-6 rounded-full bg-primary-400 fill-transparent" />
                      </If>
                    </div>

                    <div className="flex-auto text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`text-sm font-bold text-current dark:text-white`}
                      >
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

                    <span className={'text-sm font-bold dark:text-white'}>
                      {plan.price}
                    </span>
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
