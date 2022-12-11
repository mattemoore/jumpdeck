import classNames from 'classnames';
import { Trans } from 'next-i18next';
import { CheckIcon } from '@heroicons/react/24/outline';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import configuration from '~/configuration';

const PLANS = configuration.stripe.plans;

const PricingTable: React.FC & {
  Item: typeof PricingItem;
  Price: typeof Price;
  FeaturesList: typeof FeaturesList;
} = () => {
  return (
    <div
      className={
        'flex flex-col items-start items-center space-y-6 lg:space-y-0' +
        ' justify-center lg:flex-row lg:space-x-8'
      }
    >
      {PLANS.map((plan) => {
        return <PricingItem selectable key={plan.stripePriceId} plan={plan} />;
      })}
    </div>
  );
};

export default PricingTable;

PricingTable.Item = PricingItem;
PricingTable.Price = Price;
PricingTable.FeaturesList = FeaturesList;

function PricingItem(
  props: React.PropsWithChildren<{
    selectable: boolean;
    plan: {
      name: string;
      stripePriceId: string;
      description: string;
      price: string;
      features: string[];
    };
  }>
) {
  const linkHref = `${configuration.paths.signUp}?utm_source=${props.plan.stripePriceId}`;

  return (
    <div
      className={classNames(
        `
         relative flex w-full flex-col justify-between space-y-4 rounded-2xl border border-gray-200
         p-6 shadow-2xl shadow-transparent duration-500 dark:border-black-300 dark:bg-black-500 lg:w-4/12 
         lg:p-5 xl:p-6 2xl:w-3/12
      `,
        {
          ['dark:hover:border-primary-500 dark:hover:bg-black-500' +
          ' hover:scale-[1.01] dark:hover:shadow-primary-500/40']:
            props.selectable,
        }
      )}
    >
      <div className={'flex flex-col space-y-1.5'}>
        <Heading type={4}>
          <span className={'font-bold dark:text-white'}>{props.plan.name}</span>
        </Heading>

        <span className={'text-lg text-gray-400 dark:text-gray-400'}>
          {props.plan.description}
        </span>
      </div>

      <Price>{props.plan.price}</Price>

      <div className={'my-2 py-2'}>
        <FeaturesList features={props.plan.features} />
      </div>

      <If condition={props.selectable}>
        <div className={'bottom-0 left-0 w-full p-0'}>
          <Button size={'large'} block href={linkHref}>
            <Trans i18nKey={'common:getStarted'} />
          </Button>
        </div>
      </If>
    </div>
  );
}

function FeaturesList(
  props: React.PropsWithChildren<{
    features: string[];
  }>
) {
  return (
    <ul className={'flex flex-col space-y-4'}>
      {props.features.map((feature) => {
        return (
          <ListItem key={feature}>
            <Trans
              i18nKey={`common:plans.features.${feature}`}
              defaults={feature}
            />
          </ListItem>
        );
      })}
    </ul>
  );
}

function Price({ children }: React.PropsWithChildren) {
  return (
    <div>
      <span className={'text-2xl font-extrabold lg:text-3xl'}>{children}</span>
    </div>
  );
}

function ListItem({ children }: React.PropsWithChildren) {
  return (
    <li className={'flex items-center space-x-4 font-medium'}>
      <div>
        <CheckIcon className={'h-5 text-primary-500'} />
      </div>

      <span className={'text-gray-500 dark:text-gray-300'}>{children}</span>
    </li>
  );
}
