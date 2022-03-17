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
        <span className={'font-semibold text-sm'}>
          <Trans i18nKey={'subscription:choosePlan'} />
        </span>
      </RadioGroup.Label>

      <div className="space-y-2.5 mt-2 w-full">
        {plans.map((plan) => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            className={({ active, checked }) =>
              `${
                active
                  ? ''
                  : 'dark:bg-black-300 hover:bg-gray-50' +
                    ' dark:hover:bg-black-400' +
                    ' dark:active:bg-black-500' +
                    ' transition-colors'
              }
                  ${
                    checked
                      ? 'dark:bg-black-400 bg-gray-100 ring-2' +
                        ' ring-primary-400 '
                      : ''
                  }
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="flex-shrink-0">
                      <If condition={checked} fallback={<UncheckIcon />}>
                        <CheckIcon className="w-6 h-6 rounded-full fill-transparent" />
                      </If>
                    </div>

                    <div className="text-sm flex-auto">
                      <RadioGroup.Label
                        as="p"
                        className={`font-bold text-sm dark:text-white text-current`}
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

                    <span className={'font-bold dark:text-white text-sm'}>
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
    <svg viewBox="0 0 24 24" className={'w-6 h-6'}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />;
    </svg>
  );
}
