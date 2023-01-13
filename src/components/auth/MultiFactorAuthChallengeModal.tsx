import {
  getMultiFactorResolver,
  MultiFactorError,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  UserCredential,
} from 'firebase/auth';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from 'reactfire';
import { FirebaseError } from 'firebase/app';
import { Trans } from 'next-i18next';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

import { useRequestState } from '~/core/hooks/use-request-state';
import useRecaptchaVerifier from '~/core/firebase/hooks/use-recaptcha-verifier';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import Spinner from '~/core/ui/Spinner';

const buttonId = `multi-factor-auth-challenge-button`;

const MultiFactorAuthChallengeModal: React.FC<{
  error: MultiFactorError;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: (credential: UserCredential) => unknown;
  cancelButton?: boolean;
}> = ({ error, isOpen, setIsOpen, onSuccess, cancelButton }) => {
  const auth = useAuth();

  const verificationIdState = useRequestState<string>();
  const verificationCodeState = useRequestState<void>();
  const getRecaptchaVerifier = useRecaptchaVerifier(buttonId);
  const phoneVerificationSent = useRef(false);

  const resolver = useMemo(() => {
    return getMultiFactorResolver(auth, error);
  }, [auth, error]);

  const { setLoading, setData, setError, state } = verificationIdState;

  const onCodeSubmit = useCallback(
    async (verificationCode: string) => {
      const verificationId = state.data;

      if (!verificationId) {
        return;
      }

      verificationCodeState.setLoading(true);

      const phoneAuthCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

      try {
        const credential = await resolver.resolveSignIn(multiFactorAssertion);

        onSuccess(credential);
      } catch (e) {
        const error = e as FirebaseError;
        verificationCodeState.setError(error.code);
      }
    },
    [onSuccess, resolver, state.data, verificationCodeState]
  );

  useEffect(() => {
    if (state.loading || state.data || phoneVerificationSent.current) {
      return;
    }

    setLoading(true);
    phoneVerificationSent.current = true;

    const phoneInfoOptions = {
      multiFactorHint: resolver.hints[0],
      session: resolver.session,
    };

    const phoneAuthProvider = new PhoneAuthProvider(auth);

    void (async () => {
      try {
        const recaptchaVerifier = await getRecaptchaVerifier();

        const verificationId = await phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaVerifier
        );

        setData(verificationId);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [
    auth,
    resolver.session,
    resolver.hints,
    getRecaptchaVerifier,
    setData,
    setLoading,
    setError,
    state.data,
    state.loading,
  ]);

  return (
    <>
      <div id={buttonId} />

      <Modal
        heading={<Trans i18nKey={'auth:verificationCode'} />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closeButton={cancelButton}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget);
            const code = data.get(`verificationCode`) as string;

            if (!code) {
              return;
            }

            await onCodeSubmit(code);
          }}
        >
          <If condition={state.loading}>
            <LoadingSpinner />
          </If>

          <If condition={state.error}>
            <Alert type={'error'}>
              <Trans i18nKey={'auth:sendMfaCodeError'} />
            </Alert>
          </If>

          <If condition={state.data}>
            <div className={'flex flex-col space-y-3'}>
              <TextField.Label>
                <Trans i18nKey={'auth:verificationCode'} />

                <TextField.Input
                  autoComplete={'off'}
                  required
                  name={'verificationCode'}
                />

                <TextField.Hint>
                  <Trans i18nKey={'auth:verificationCodeHint'} />
                </TextField.Hint>
              </TextField.Label>

              <If condition={verificationCodeState.state.error}>
                <AuthErrorMessage
                  error={verificationCodeState.state.error as string}
                />
              </If>

              <Button
                loading={verificationCodeState.state.loading}
                block
                type={'submit'}
              >
                <Trans i18nKey={'auth:verificationCodeSubmitButtonLabel'} />
              </Button>
            </div>
          </If>
        </form>
      </Modal>
    </>
  );
};

function LoadingSpinner() {
  return (
    <div className={'my-6 flex flex-col items-center justify-center space-y-4'}>
      <div>
        <Spinner />
      </div>

      <div>
        <p>
          <Trans i18nKey={'auth:sendingMfaCode'} />
        </p>
      </div>
    </div>
  );
}

export default MultiFactorAuthChallengeModal;
