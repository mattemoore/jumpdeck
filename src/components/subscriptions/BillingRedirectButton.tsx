import React from 'react';
import dynamic from 'next/dynamic';

import Button from '~/core/ui/Button';
import configuration from '~/configuration';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const BILLING_PORTAL_REDIRECT_ENDPOINT = configuration.paths.api.billingPortal;

const CSRFTokenInput = dynamic(() => import('./CsrfTokenInput'), {
  ssr: false,
});

const BillingPortalRedirectButton: React.FCC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form method="POST" action={BILLING_PORTAL_REDIRECT_ENDPOINT}>
      <CSRFTokenInput />

      <input type={'hidden'} name={'customerId'} value={customerId} />

      <Button color={'secondary'} className={className}>
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-4'} />
        </span>
      </Button>
    </form>
  );
};

export default BillingPortalRedirectButton;
