import React, { useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';

import Plans from '~/components/subscriptions/Plans';
import SettingsPageContainer from '~/components/SettingsPageContainer';

import { withAppProps } from '~/lib/props/with-app-props';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

enum SubscriptionPageStatus {
  Success,
  Canceled,
  Error,
}

const Subscription = () => {
  const [status, setStatus] = useState<SubscriptionPageStatus>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error = params.has(`error`);
    const canceled = params.has(`canceled`);
    const success = params.has(`success`);

    if (canceled) {
      setStatus(SubscriptionPageStatus.Canceled);
    } else if (success) {
      setStatus(SubscriptionPageStatus.Success);
    } else if (error) {
      setStatus(SubscriptionPageStatus.Error);
    }
  }, [setStatus]);

  return (
    <>
      <Head>
        <title key="title">Subscription Settings</title>
      </Head>

      <SettingsPageContainer title={'Subscription'}>
        <div className={'w-full'}>
          <div className={'flex flex-col space-y-4 px-2'}>
            <If condition={status !== undefined}>
              <div>
                <PlansStatusAlert status={status as SubscriptionPageStatus} />
              </div>
            </If>

            <Plans />
          </div>
        </div>
      </SettingsPageContainer>
    </>
  );
};

export default Subscription;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function PlansStatusAlert({ status }: { status: SubscriptionPageStatus }) {
  switch (status) {
    case SubscriptionPageStatus.Canceled:
      return (
        <Alert type={'warn'} useCloseButton={true}>
          <Trans i18nKey={'subscription:checkOutCanceledAlert'} />
        </Alert>
      );

    case SubscriptionPageStatus.Error:
      return (
        <Alert type={'error'} useCloseButton={true}>
          <Trans i18nKey={'subscription:unknownErrorAlert'} />
        </Alert>
      );

    case SubscriptionPageStatus.Success:
      return (
        <Alert type={'success'} useCloseButton={true}>
          <Trans i18nKey={'subscription:checkOutCompletedAlert'} />
        </Alert>
      );
  }
}
