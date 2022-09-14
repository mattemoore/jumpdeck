import { sendEmailVerification, User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import toaster from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

import { useRequestState } from '~/core/hooks/use-request-state';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

function EmailVerificationAlert(
  props: React.PropsWithChildren<{
    user: User;
  }>
) {
  const requestState = useRequestState<void>();
  const { t } = useTranslation();

  const onLinkRequested = useCallback(async () => {
    requestState.setLoading(true);

    const promise = sendEmailVerification(props.user);

    await toaster.promise(promise, {
      loading: t(`profile:sendingEmailVerificationLink`),
      success: t(`profile:sendEmailVerificationLinkSuccess`),
      error: t(`profile:sendEmailVerificationLinkError`),
    });

    requestState.setData();
  }, [props, requestState, t]);

  return (
    <div className={'flex flex-col space-y-3'}>
      <div>
        <Alert type={'warn'}>
          <div>
            <p>
              <Trans i18nKey={'profile:verificationLinkAlertDescription'} />
            </p>
          </div>
        </Alert>
      </div>

      <div>
        <If
          condition={requestState.state.success}
          fallback={
            <Button
              loading={requestState.state.loading}
              onClick={onLinkRequested}
            >
              <Trans i18nKey={'profile:sendVerificationLinkSubmitLabel'} />
            </Button>
          }
        >
          <span className={'flex space-x-2'}>
            <CheckCircleIcon className={'h-6 text-green-500'} />
            <span>
              <Trans i18nKey={'profile:sendVerificationLinkSuccessLabel'} />
            </span>
          </span>
        </If>
      </div>
    </div>
  );
}

export default EmailVerificationAlert;
