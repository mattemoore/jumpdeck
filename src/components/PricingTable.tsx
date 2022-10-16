import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';
import classNames from 'classnames';
import { Trans } from 'next-i18next';

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
        ' justify-center lg:flex-row lg:space-x-4'
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
         relative flex w-full flex-col justify-between rounded-2xl border-2 border-gray-100
         p-4 shadow-2xl shadow-transparent transition-all duration-500 dark:border-black-300 dark:bg-black-500 
         sm:p-6 lg:w-4/12 xl:p-8 2xl:w-3/12
      `,
        {
          ['dark:hover:border-primary-500 dark:hover:bg-black-500' +
          ' hover:scale-[1.01] dark:hover:shadow-primary-500/40']:
            props.selectable,
        }
      )}
    >
      <div className={'flex flex-col space-y-4'}>
        <Heading type={2}>
          <span className={'font-semibold dark:text-white'}>
            {props.plan.name}
          </span>
        </Heading>

        <Price>{props.plan.price}</Price>

        <span className={'text-xl text-gray-500 dark:text-gray-400'}>
          {props.plan.description}
        </span>
      </div>

      <div className={'my-4 py-4'}>
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
    <ul className={'flex flex-col space-y-2'}>
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
      <span className={'text-3xl font-extrabold lg:text-4xl'}>{children}</span>
    </div>
  );
}

function ListItem({ children }: React.PropsWithChildren) {
  return (
    <li className={'flex items-center space-x-3 text-lg font-medium'}>
      <div>
        <CheckCircleIcon className={'h-7 text-green-500'} />
      </div>

      <span>{children}</span>
    </li>
  );
}
