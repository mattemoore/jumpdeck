import { useUser } from 'reactfire';
import { useCallback } from 'react';
import { sendEmailVerification, User } from 'firebase/auth';
import { Trans } from 'next-i18next';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import { useRequestState } from '~/core/hooks/use-request-state';

function VerifyEmailAlert() {
  const { data: user } = useUser();
  const state = useRequestState();

  const onSendEmail = useCallback(
    async (user: User) => {
      try {
        state.setLoading(true);

        await sendEmailVerification(user, {
          url: window.location.href,
        });

        state.setData(null);
      } catch (error) {
        state.setError(error);
      }
    },
    [state]
  );

  return (
    <Alert type={'warn'}>
      <Alert.Heading>
        <Trans i18nKey={'auth:emailConfirmationAlertHeading'} />
      </Alert.Heading>

      <div className={'flex flex-col space-y-4'}>
        <p>
          <Trans i18nKey={'auth:emailConfirmationAlertBody'} />
        </p>

        <If condition={state.state.success}>
          <p className={'flex items-center space-x-2 text-sm'}>
            <CheckCircleIcon className={'h-4'} />

            <span>
              <Trans i18nKey={'auth:sendAgainEmailVerificationSuccess'} />
            </span>
          </p>
        </If>

        <If condition={user && !state.state.success}>
          <div>
            <Button
              loading={state.state.loading}
              className={'hover:color-yellow-900 border border-yellow-600'}
              color={'custom'}
              size={'small'}
              onClick={() => user && onSendEmail(user)}
            >
              <Trans i18nKey={'auth:sendAgainEmailVerificationLabel'} />
            </Button>
          </div>
        </If>
      </div>
    </Alert>
  );
}

export default VerifyEmailAlert;
