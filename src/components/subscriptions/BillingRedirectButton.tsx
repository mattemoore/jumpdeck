import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import configuration from '~/configuration';
import { useGetCsrfToken } from '~/core/firebase/hooks/use-get-csrf-token';

const BILLING_PORTAL_REDIRECT_ENDPOINT = configuration.paths.api.billingPortal;

const BillingPortalRedirectButton: React.FCC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  const getCsrfToken = useGetCsrfToken();

  return (
    <form method="POST" action={BILLING_PORTAL_REDIRECT_ENDPOINT}>
      <input type={'hidden'} name={'customerId'} value={customerId} />

      <input
        type="hidden"
        name={'csrfToken'}
        defaultValue={getCsrfToken() ?? ''}
      />

      <Button size={'large'} color={'secondary'} className={className}>
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-6'} />
        </span>
      </Button>
    </form>
  );
};

export default BillingPortalRedirectButton;
