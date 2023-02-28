import React, { useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';

import Plans from '~/components/subscriptions/Plans';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';

import { withAppProps } from '~/lib/props/with-app-props';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import SettingsTile from '~/components/settings/SettingsTile';

enum SubscriptionStatusQueryParams {
  Success = 'success',
  Cancel = 'cancel',
  Error = 'error',
}

const Subscription = () => {
  const status = useSubscriptionStatus();

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key="title">Subscription</title>
      </Head>

      <div className={'w-full'}>
        <SettingsTile
          heading={<Trans i18nKey={'common:subscriptionSettingsTabLabel'} />}
          subHeading={
            <Trans i18nKey={'subscription:subscriptionTabSubheading'} />
          }
        >
          <div className={'flex flex-col space-y-4'}>
            <If condition={status !== undefined}>
              <PlansStatusAlert
                status={status as SubscriptionStatusQueryParams}
              />
            </If>

            <Plans />
          </div>
        </SettingsTile>
      </div>
    </SettingsPageContainer>
  );
};

export default Subscription;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function PlansStatusAlert({
  status,
}: {
  status: SubscriptionStatusQueryParams;
}) {
  switch (status) {
    case SubscriptionStatusQueryParams.Cancel:
      return (
        <Alert type={'warn'} useCloseButton>
          <Alert.Heading>
            <Trans i18nKey={'subscription:checkOutCanceledAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:checkOutCanceledAlert'} />
          </p>
        </Alert>
      );

    case SubscriptionStatusQueryParams.Error:
      return (
        <Alert type={'error'} useCloseButton>
          <Alert.Heading>
            <Trans i18nKey={'subscription:unknownErrorAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:unknownErrorAlert'} />
          </p>
        </Alert>
      );

    case SubscriptionStatusQueryParams.Success:
      return (
        <Alert type={'success'} useCloseButton>
          <Alert.Heading>
            <Trans i18nKey={'subscription:checkOutCompletedAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:checkOutCompletedAlert'} />
          </p>
        </Alert>
      );
  }
}

function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatusQueryParams>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error = params.has(SubscriptionStatusQueryParams.Error);
    const canceled = params.has(SubscriptionStatusQueryParams.Cancel);
    const success = params.has(SubscriptionStatusQueryParams.Success);

    if (canceled) {
      setStatus(SubscriptionStatusQueryParams.Cancel);
    } else if (success) {
      setStatus(SubscriptionStatusQueryParams.Success);
    } else if (error) {
      setStatus(SubscriptionStatusQueryParams.Error);
    }
  }, []);

  return status;
}
