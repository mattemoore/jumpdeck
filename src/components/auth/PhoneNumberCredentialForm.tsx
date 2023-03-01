import { FormEventHandler, useCallback } from 'react';
import { FirebaseError } from 'firebase/app';
import type { ConfirmationResult, UserCredential } from 'firebase/auth';
import { useAuth } from 'reactfire';
import toaster from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import useRecaptchaVerifier from '~/core/firebase/hooks/use-recaptcha-verifier';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useRequestState } from '~/core/hooks/use-request-state';

import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';

type ActionType = 'signIn' | 'link';

const RECAPTCHA_ACTION_BUTTON_ID = 'phone-recaptcha-button';

const PhoneNumberCredentialForm: React.FC<{
  action: ActionType;
  onSuccess: (credential: UserCredential) => void;
}> = ({ action, onSuccess }) => {
  const { t } = useTranslation();

  const verifyPhoneNumberState = useRequestState<ConfirmationResult>();
  const verifyVerificationCodeState = useRequestState<void>();
  const getPhoneNumberSignInMethod = useGetPhoneNumberSignInMethod(action);

  const onLinkPhoneNumberSubmit: FormEventHandler<HTMLFormElement> =
    useCallback(
      async (event) => {
        event.preventDefault();

        verifyPhoneNumberState.setLoading(true);

        const data = new FormData(event.currentTarget);
        const phoneNumber = data.get('phoneNumber') as string;

        const promise = getPhoneNumberSignInMethod(phoneNumber)
          .then((confirmationResult) => {
            // when confirmationResult is received
            // we set it as the state of verifyPhoneNumberState
            verifyPhoneNumberState.setData(confirmationResult);
          })
          .catch((error) => {
            verifyPhoneNumberState.setError(error);

            throw getFirebaseErrorCode(error);
          });

        await toaster.promise(promise, {
          loading: t(`profile:verifyPhoneNumberLoading`),
          success: t(`profile:verifyPhoneNumberSuccess`),
          error: t(`profile:verifyPhoneNumberError`),
        });
      },
      [verifyPhoneNumberState, getPhoneNumberSignInMethod, t]
    );

  const onVerificationCodeSubmit: FormEventHandler<HTMLFormElement> =
    useCallback(
      async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const verificationCode = data.get('verificationCode') as string;

        // confirmation code is stored as the state of verifyPhoneNumberState
        const confirmationResult = verifyPhoneNumberState.state.data;

        // in the weird event we do not have a verifyPhoneNumberState
        // we simply exit the function
        if (!confirmationResult) {
          return;
        }

        verifyVerificationCodeState.setLoading(true);

        // we verify that the verification code is correct
        const promise = confirmationResult
          .confirm(verificationCode)
          .then(onSuccess)
          .catch((error: FirebaseError) => {
            verifyVerificationCodeState.setError(error);

            throw getFirebaseErrorCode(error);
          });

        await toaster.promise(promise, {
          loading: t(`profile:verificationCodeLoading`),
          success: t(`profile:verificationCodeSuccess`),
          error: t(`profile:verificationCodeError`),
        });
      },
      [
        verifyPhoneNumberState.state.data,
        verifyVerificationCodeState,
        t,
        onSuccess,
      ]
    );

  // if verifyPhoneNumberState's state is not set, we dispplay the phone
  // number form
  const shouldDisplayPhoneNumberForm =
    verifyPhoneNumberState.state.data === undefined;

  // otherwise, we display the verification code form
  const shouldDisplayVerificationCodeForm = !shouldDisplayPhoneNumberForm;

  return (
    <>
      <If condition={shouldDisplayPhoneNumberForm}>
        <form className={'w-full'} onSubmit={onLinkPhoneNumberSubmit}>
          <div className={'flex flex-col space-y-2'}>
            <TextField.Label>
              <Trans i18nKey={'profile:phoneNumberLabel'} />

              <TextField.Input
                required
                pattern={'^\\+?[1-9]\\d{1,14}$'}
                name={'phoneNumber'}
                type={'tel'}
                placeholder={'Ex. +919367788755'}
                disabled={verifyPhoneNumberState.state.loading}
              />
            </TextField.Label>

            <If condition={verifyPhoneNumberState.state.error}>
              {(error) => (
                <AuthErrorMessage error={getFirebaseErrorCode(error)} />
              )}
            </If>

            <Button
              id={RECAPTCHA_ACTION_BUTTON_ID}
              block
              type={'submit'}
              loading={verifyPhoneNumberState.state.loading}
            >
              <If condition={action === 'link'}>
                <Trans i18nKey={'profile:verifyPhoneNumberSubmitLabel'} />
              </If>

              <If condition={action === 'signIn'}>
                <Trans i18nKey={'auth:signInWithPhoneNumber'} />
              </If>
            </Button>
          </div>
        </form>
      </If>

      <If condition={shouldDisplayVerificationCodeForm}>
        <form className={'w-full'} onSubmit={onVerificationCodeSubmit}>
          <div className={'flex flex-col space-y-3'}>
            <TextField.Label>
              <Trans i18nKey={'profile:verificationCode'} />

              <TextField.Input
                required
                autoComplete={'off'}
                name={'verificationCode'}
              />

              <TextField.Hint>
                <Trans i18nKey={'profile:verifyActivationCodeDescription'} />
              </TextField.Hint>
            </TextField.Label>

            <If condition={verifyVerificationCodeState.state.error}>
              {(error) => (
                <AuthErrorMessage error={getFirebaseErrorCode(error)} />
              )}
            </If>

            <Button block loading={verifyVerificationCodeState.state.loading}>
              <Trans i18nKey={'profile:verifyActivationCodeSubmitLabel'} />
            </Button>
          </div>
        </form>
      </If>
    </>
  );
};

function useGetPhoneNumberSignInMethod(action: ActionType) {
  const auth = useAuth();
  const getRecaptchaVerifier = useRecaptchaVerifier(RECAPTCHA_ACTION_BUTTON_ID);

  return useCallback(
    async (phoneNumber: string) => {
      const verifier = await getRecaptchaVerifier();

      if (action === `link`) {
        const { linkWithPhoneNumber } = await import('firebase/auth');
        const user = auth.currentUser;

        if (!user) {
          return Promise.reject(`User is not logged in`);
        }

        return linkWithPhoneNumber(user, phoneNumber, verifier);
      }

      if (action === `signIn`) {
        const { signInWithPhoneNumber } = await import('firebase/auth');

        return signInWithPhoneNumber(auth, phoneNumber, verifier);
      }

      return Promise.reject(`Invalid action "${action}"`);
    },
    [action, auth, getRecaptchaVerifier]
  );
}

export default PhoneNumberCredentialForm;
