import dynamic from 'next/dynamic';
import React from 'react';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import classNames from 'classnames';

import Button from '~/core/ui/Button';
import configuration from '~/configuration';
import { isBrowser } from '~/core/generic/is-browser';

const CHECKOUT_SESSION_API_ENDPOINT = configuration.paths.api.checkout;

const CSRFTokenInput = dynamic(() => import('./CsrfTokenInput'), {
  ssr: false,
});

const CheckoutRedirectButton: React.FCC<{
  stripePriceId?: string;
  recommended?: boolean;
  disabled?: boolean;
  organizationId: Maybe<string>;
  customerId: Maybe<string>;
}> = ({ children, ...props }) => {
  return (
    <form
      className={'w-full'}
      data-cy={'checkout-form'}
      action={CHECKOUT_SESSION_API_ENDPOINT}
      method="POST"
    >
      <CheckoutFormData
        customerId={props.customerId}
        organizationId={props.organizationId}
        priceId={props.stripePriceId}
      />

      <Button
        block
        className={classNames({
          'bg-primary-contrast text-gray-800': props.recommended,
        })}
        color={props.recommended ? 'custom' : 'secondary'}
        type="submit"
        disabled={props.disabled}
      >
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-5'} />
        </span>
      </Button>
    </form>
  );
};

export default CheckoutRedirectButton;

function CheckoutFormData(
  props: React.PropsWithChildren<{
    organizationId: Maybe<string>;
    priceId: Maybe<string>;
    customerId: Maybe<string>;
  }>
) {
  return (
    <>
      <CSRFTokenInput />

      <input
        type="hidden"
        name={'organizationId'}
        defaultValue={props.organizationId}
      />

      <input type="hidden" name={'returnUrl'} defaultValue={getReturnUrl()} />
      <input type="hidden" name={'priceId'} defaultValue={props.priceId} />

      <input
        type="hidden"
        name={'customerId'}
        defaultValue={props.customerId}
      />
    </>
  );
}

function getReturnUrl() {
  return isBrowser()
    ? [window.location.origin, window.location.pathname].join('')
    : undefined;
}
