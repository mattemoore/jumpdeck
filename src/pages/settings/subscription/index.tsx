import React, { useEffect, useState } from 'react';

import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';

import Plans from '~/components/subscriptions/Plans';

import { withAppProps } from '~/lib/props/with-app-props';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import SettingsPageContainer from '~/components/SettingsPageContainer';

enum Status {
  Success,
  Canceled,
  Error,
}

const Subscription = () => {
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error = params.has(`error`);
    const canceled = params.has(`canceled`);
    const success = params.has(`success`);

    if (canceled) {
      setStatus(Status.Canceled);
    } else if (success) {
      setStatus(Status.Success);
    } else if (error) {
      setStatus(Status.Error);
    }
  }, [setStatus]);

  return (
    <SettingsPageContainer title={'Subscription'}>
      <Head>
        <title key="title">Subscription Settings</title>
      </Head>

      <div className={'flex flex-col space-y-4 px-2'}>
        <If condition={status !== undefined}>
          <div>
            <PlansStatusAlert status={status as Status} />
          </div>
        </If>

        <Plans />
      </div>
    </SettingsPageContainer>
  );
};

export default Subscription;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function PlansStatusAlert({ status }: { status: Status }) {
  return (
    <>
      <If condition={status === Status.Error}>
        <Alert type={'error'} useCloseButton={true}>
          <Trans i18nKey={'subscription:unknownErrorAlert'} />
        </Alert>
      </If>

      <If condition={status === Status.Canceled}>
        <Alert type={'warn'} useCloseButton={true}>
          <Trans i18nKey={'subscription:checkOutCanceledAlert'} />
        </Alert>
      </If>

      <If condition={status === Status.Success}>
        <Alert type={'success'} useCloseButton={true}>
          <Trans i18nKey={'subscription:checkOutCompletedAlert'} />
        </Alert>
      </If>
    </>
  );
}
