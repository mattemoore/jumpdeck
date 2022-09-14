import React from 'react';

import Button from '~/core/ui/Button';
import configuration from '~/configuration';
import { isBrowser } from '~/core/generic';
import { useGetCsrfToken } from '~/core/firebase/hooks/use-get-csrf-token';

const CHECKOUT_SESSION_API_ENDPOINT = configuration.paths.api.checkout;

const CheckoutRedirectButton: React.FCC<{
  disabled?: boolean;
  priceId: Maybe<string>;
  organizationId: Maybe<string>;
  customerId: Maybe<string>;
}> = ({ children, ...props }) => {
  return (
    <form
      data-cy={'checkout-form'}
      action={CHECKOUT_SESSION_API_ENDPOINT}
      method="POST"
    >
      <CheckoutFormData
        customerId={props.customerId}
        organizationId={props.organizationId}
        priceId={props.priceId}
      />

      <Button color={'primary'} type="submit" disabled={props.disabled}>
        {children}
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
  const getCsrfToken = useGetCsrfToken();

  return (
    <>
      <input
        type="hidden"
        name={'organizationId'}
        defaultValue={props.organizationId}
      />

      <input
        type="hidden"
        name={'csrfToken'}
        defaultValue={getCsrfToken() ?? ''}
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
