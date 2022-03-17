import React from 'react';
import Button from '~/core/ui/Button';
import configuration from '~/configuration';

const BILLING_PORTAL_REDIRECT_ENDPOINT = configuration.paths.api.billingPortal;

const BillingPortalRedirectButton: React.FC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form method="POST" action={BILLING_PORTAL_REDIRECT_ENDPOINT}>
      <input type={'hidden'} name={'customerId'} value={customerId} />

      <Button color={'secondary'} className={className}>
        {children}
      </Button>
    </form>
  );
};

export default BillingPortalRedirectButton;
