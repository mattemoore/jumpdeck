import { FormEventHandler, useCallback } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { multiFactor, PhoneAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import toaster from 'react-hot-toast';
import { useAuth } from 'reactfire';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import { useRequestState } from '~/core/hooks/use-request-state';
import useRecaptchaVerifier from '~/core/firebase/hooks/use-recaptcha-verifier';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';

const buttonId = `multi-factor-auth-phone-number-button`;

const MultiFactorAuthPhoneNumberForm: React.FC<{
  onComplete: (verificationId: string) => void;
  onReauthenticateError: () => void;
}> = ({ onComplete, onReauthenticateError }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const requestState = useRequestState<void>();
  const getRecaptchaVerifier = useRecaptchaVerifier(buttonId);

  const onVerifyPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      const user = auth.currentUser;

      if (!user || requestState.state.loading) {
        return;
      }

      requestState.setLoading(true);

      const multiFactorSession = await multiFactor(user).getSession();

      const phoneInfoOptions = {
        phoneNumber: phoneNumber,
        session: multiFactorSession,
      };

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const recaptchaVerifier = await getRecaptchaVerifier();

      const promise = phoneAuthProvider
        .verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
        .then((verificationId) => {
          requestState.setData();

          onComplete(verificationId);

          return t(`profile:verifyPhoneNumberSuccess`);
        })
        .catch((error: FirebaseError) => {
          // when we receive a reauthentication error
          // we simply ask the container to change form rather than displaying
          // an actual error
          if (isNeedsReauthenticationError(error)) {
            onReauthenticateError();

            return t(`auth:auth/requires-recent-login`);
          } else {
            // otherwise, it's a real error and we display it
            requestState.setError(error);

            throw error.code;
          }
        });

      await toaster.promise(promise, {
        success: (value) => value,
        error: t(`profile:verifyPhoneNumberError`),
        loading: t(`profile:verifyPhoneNumberLoading`),
      });
    },
    [
      auth,
      requestState,
      getRecaptchaVerifier,
      t,
      onComplete,
      onReauthenticateError,
    ]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const data = new FormData(e.currentTarget);
      const phoneNumber = data.get('phoneNumber') as string;

      return onVerifyPhoneNumber(phoneNumber);
    },
    [onVerifyPhoneNumber]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className={'mb-2.5 text-gray-400 dark:text-gray-400'}>
        <Trans i18nKey={'profile:verifyPhoneNumberDescription'} />
      </div>

      <div className={'flex flex-col space-y-2'}>
        <TextField.Label>
          <Trans i18nKey={'profile:phoneNumberLabel'} />

          <TextField.Input
            required
            pattern={'^\\+?[1-9]\\d{1,14}$'}
            name={'phoneNumber'}
            type={'tel'}
            placeholder={'Ex. +919367788755'}
            disabled={requestState.state.loading}
          />
        </TextField.Label>

        <If condition={requestState.state.error}>
          <AuthErrorMessage
            error={getFirebaseErrorCode(requestState.state.error)}
          />
        </If>

        <Button
          id={buttonId}
          block
          type={'submit'}
          loading={requestState.state.loading}
        >
          <Trans i18nKey={'profile:verifyPhoneNumberSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

function isNeedsReauthenticationError(error: FirebaseError) {
  return error.code === 'auth/requires-recent-login';
}

export default MultiFactorAuthPhoneNumberForm;
