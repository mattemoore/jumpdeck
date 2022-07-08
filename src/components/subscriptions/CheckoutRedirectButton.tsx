import React from 'react';

import Button from '~/core/ui/Button';
import configuration from '~/configuration';

const CHECKOUT_SESSION_API_ENDPOINT = configuration.paths.api.checkout;

const CheckoutRedirectButton: React.FCC<{
  disabled?: boolean;
  priceId: Maybe<string>;
  organizationId: Maybe<string>;
  customerId: Maybe<string>;
}> = ({ children, ...props }) => {
  return (
    <form action={CHECKOUT_SESSION_API_ENDPOINT} method="POST">
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
  return (
    <>
      <input
        type="hidden"
        name={'organizationId'}
        defaultValue={props.organizationId}
      />

      <input type="hidden" name={'priceId'} defaultValue={props.priceId} />

      <input
        type="hidden"
        name={'customerId'}
        defaultValue={props.customerId}
      />
    </>
  );
}
