import { Trans, useTranslation } from 'next-i18next';
import { FormEventHandler, useCallback } from 'react';
import { useAuth } from 'reactfire';
import { sendSignInLinkToEmail } from 'firebase/auth';
import toast from 'react-hot-toast';

import { useRequestState } from '~/core/hooks/use-request-state';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

import configuration from '~/configuration';

const EmailLinkAuth: React.FC = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const { state, setLoading, setData, setError } = useRequestState<void>();

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const target = event.currentTarget;
      const data = new FormData(target);
      const email = data.get('email') as string;
      const url = getAuthUrl();

      setLoading(true);

      const settings = {
        url,
        handleCodeInApp: true,
      };

      const promise = sendSignInLinkToEmail(auth, email, settings)
        .then(() => {
          storeEmailInStorage(email);

          setData();
        })
        .catch((error) => {
          setError(error);

          throw getFirebaseErrorCode(error);
        });

      await toast.promise(promise, {
        loading: t('auth:sendingEmailLink'),
        success: t(`auth:sendLinkSuccessToast`),
        error: t(`auth:errors.link`),
      });
    },
    [auth, t, setData, setError, setLoading]
  );

  if (state.success) {
    return (
      <Alert type={'success'}>
        <Trans i18nKey={'auth:sendLinkSuccess'} />
      </Alert>
    );
  }

  return (
    <form className={'w-full'} onSubmit={onSubmit}>
      <div className={'flex flex-col space-y-4'}>
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'common:emailAddress'} />

            <TextField.Input
              data-cy={'email-input'}
              required
              type="email"
              placeholder={'your@email.com'}
              name={'email'}
            />
          </TextField.Label>
        </TextField>

        <Button loading={state.loading}>
          <If
            condition={state.loading}
            fallback={<Trans i18nKey={'auth:sendEmailLink'} />}
          >
            <Trans i18nKey={'auth:sendingEmailLink'} />
          </If>
        </Button>
      </div>

      <If condition={state.error}>
        <Alert type={'error'}>
          <Trans i18nKey={'auth:errors.link'} />
        </Alert>
      </If>
    </form>
  );
};

function getAuthUrl() {
  const origin = window.location.origin;
  const path = configuration.paths.emailLinkSignIn;

  return [origin, path].join('');
}

function storeEmailInStorage(email: string) {
  window.localStorage.setItem('emailForSignIn', email);
}

export default EmailLinkAuth;
