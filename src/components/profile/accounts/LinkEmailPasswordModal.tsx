import { useAuth } from 'reactfire';
import { useCallback, useEffect, useState } from 'react';

import {
  EmailAuthProvider,
  linkWithCredential,
  MultiFactorError,
  signInWithCredential,
} from 'firebase/auth';

import { useForm } from 'react-hook-form';
import toaster from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import { useRequestState } from '~/core/hooks/use-request-state';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

function LinkEmailPasswordModal({
  isOpen,
  setIsOpen,
}: React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>) {
  const auth = useAuth();
  const { t } = useTranslation();
  const { state, setLoading, setError, resetState } = useRequestState<void>();
  const [sessionRequest] = useCreateServerSideSession();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const user = auth.currentUser;

  const { register, handleSubmit, watch, reset, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const errors = formState.errors;

  const emailControl = register('email', { required: true });

  const passwordControl = register('password', {
    required: true,
    minLength: {
      value: 6,
      message: t<string>(`auth:passwordLengthError`),
    },
  });

  const passwordValue = watch(`password`);

  const repeatPasswordControl = register('repeatPassword', {
    required: true,
    minLength: {
      value: 6,
      message: t<string>(`auth:passwordLengthError`),
    },
    validate: (value) => {
      if (value !== passwordValue) {
        return t<string>(`auth:passwordsDoNotMatch`);
      }

      return true;
    },
  });

  const onSubmit = useCallback(
    async (params: { email: string; password: string }) => {
      if (state.loading || !user) {
        return;
      }

      setLoading(true);

      const authCredential = EmailAuthProvider.credential(
        params.email,
        params.password
      );

      const promise = new Promise<void>((resolve, reject) => {
        return linkWithCredential(user, authCredential)
          .then(async () => {
            const newCredential = await signInWithCredential(
              auth,
              authCredential
            );

            // we need to re-create the server-side session, because for
            // some reason Firebase expires the session cookie after linking
            // a password
            await sessionRequest(newCredential.user);

            resolve();
          })
          .catch((error) => {
            if (isMultiFactorError(error)) {
              setMultiFactorAuthError(error);
              setIsOpen(false);
              toaster.dismiss();
            } else {
              setError(error);

              return reject();
            }
          });
      });

      await toaster.promise(promise, {
        success: t(`profile:linkActionSuccess`),
        error: t(`profile:linkActionError`),
        loading: t(`profile:linkActionLoading`),
      });

      resetState();
      setIsOpen(false);
      reset();
    },
    [
      state.loading,
      setLoading,
      t,
      resetState,
      setIsOpen,
      reset,
      user,
      auth,
      sessionRequest,
      setError,
    ]
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
    }

    return () => {
      reset();
    };
  }, [reset, isOpen]);

  return (
    <>
      <Modal heading={`Link Password`} isOpen={isOpen} setIsOpen={setIsOpen}>
        <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
          <div className={'flex-col space-y-2.5'}>
            <TextField>
              <TextField.Label>
                <Trans i18nKey={'common:emailAddress'} />

                <TextField.Input
                  {...emailControl}
                  data-cy={'email-input'}
                  required
                  type="email"
                  placeholder={'your@email.com'}
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'common:password'} />

                <TextField.Input
                  {...passwordControl}
                  data-cy={'password-input'}
                  required
                  type="password"
                  placeholder={''}
                />

                <TextField.Hint>
                  <Trans i18nKey={'auth:passwordHint'} />
                </TextField.Hint>

                <TextField.Error error={errors.password?.message} />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'auth:repeatPassword'} />

                <TextField.Input
                  {...repeatPasswordControl}
                  data-cy={'repeat-password-input'}
                  required
                  type="password"
                  placeholder={''}
                />
              </TextField.Label>

              <TextField.Error error={errors.repeatPassword?.message} />
            </TextField>

            <If condition={state.error}>
              {(error) => (
                <AuthErrorMessage error={getFirebaseErrorCode(error)} />
              )}
            </If>

            <div>
              <Button
                block
                data-cy={'auth-submit-button'}
                className={'w-full'}
                color={'primary'}
                type="submit"
                loading={state.loading}
              >
                <If
                  condition={state.loading}
                  fallback={<Trans i18nKey={'profile:linkAccount'} />}
                >
                  <Trans i18nKey={'profile:linkActionLoading'} />
                </If>
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async (credential) => {
              await sessionRequest(credential.user);

              setMultiFactorAuthError(undefined);
              reset();
              resetState();
            }}
          />
        )}
      </If>
    </>
  );
}

export default LinkEmailPasswordModal;
