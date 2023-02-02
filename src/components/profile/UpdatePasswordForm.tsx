import {
  EmailAuthProvider,
  MultiFactorError,
  reauthenticateWithCredential,
  updatePassword,
  User,
  UserCredential,
} from 'firebase/auth';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';
import { useRequestState } from '~/core/hooks/use-request-state';

const UpdatePasswordForm: React.FCC<{ user: User }> = ({ user }) => {
  const { t } = useTranslation();
  const [createServerSideSession] = useCreateServerSideSession();
  const requestState = useRequestState<void>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const { register, handleSubmit, getValues, reset, formState } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const errors = formState.errors;

  const currentPasswordControl = register('currentPassword', {
    value: '',
    required: true,
    minLength: {
      value: 6,
      message: t<string>(`auth:passwordLengthError`),
    },
  });

  const newPasswordControl = register('newPassword', {
    value: '',
    required: true,
    minLength: {
      value: 6,
      message: t<string>(`auth:passwordLengthError`),
    },
    validate: (value) => {
      // current password cannot be the same as the current one
      if (value === getValues('currentPassword')) {
        return t<string>(`profile:passwordNotChanged`);
      }
    },
  });

  const repeatPasswordControl = register('repeatPassword', {
    value: '',
    required: true,
    minLength: {
      value: 6,
      message: t<string>(`auth:passwordLengthError`),
    },
    validate: (value) => {
      // new password and repeat new password must match
      if (value !== getValues('newPassword')) {
        return t<string>(`profile:passwordNotMatching`);
      }
    },
  });

  const reauthenticateUser = useCallback(
    (email: string, currentPassword: string) => {
      const emailAuthCredential = EmailAuthProvider.credential(
        email,
        currentPassword
      );

      // first, we check if the password is correct
      return reauthenticateWithCredential(user, emailAuthCredential).catch(
        (error) => {
          // if we hit a MFA error, it means we need to display an MFA modal
          // and request the verification code sent by SMS
          if (isMultiFactorError(error)) {
            setMultiFactorAuthError(error);
          } else {
            // otherwise, it's a simple error, meaning the user wasn't able
            // to authenticate
            requestState.setError(error);
            return Promise.reject(error);
          }
        }
      );
    },
    [user, setMultiFactorAuthError, requestState]
  );

  const updatePasswordFromCredential = useCallback(
    async (credential: UserCredential, newPassword: string) => {
      const promise = new Promise<void>(async (resolve, reject) => {
        try {
          // then, we update the user password
          await updatePassword(user, newPassword);

          // finally, we re-create the server token
          await createServerSideSession(credential.user);

          // set request as successful, so we can reset the form
          requestState.setData();

          resolve();
        } catch (e) {
          reject(e);
        }
      });

      return await toast.promise(promise, {
        success: t(`profile:updatePasswordSuccess`),
        error: t(`profile:updatePasswordError`),
        loading: t(`profile:updatePasswordLoading`),
      });
    },
    [requestState, createServerSideSession, t, user]
  );

  const updatePasswordCallback = useCallback(
    async (user: User, currentPassword: string, newPassword: string) => {
      const email = user.email;

      // if the user does not have an email assigned, it's possible they
      // don't have an email/password factor linked, and the UI is out of sync
      if (!email) {
        return Promise.reject(t(`profile:cannotUpdatePassword`));
      }

      try {
        // first, we check if the password is correct
        const credential = await reauthenticateUser(email, currentPassword);

        // when credential does not exist, it's possible we're in the MFA
        // flow or an error was raised
        // either way, we cannot continue without
        if (!credential) {
          return;
        }

        return await updatePasswordFromCredential(credential, newPassword);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    [reauthenticateUser, updatePasswordFromCredential, t]
  );

  const onSubmit = useCallback(
    async (params: { currentPassword: string; newPassword: string }) => {
      const { newPassword, currentPassword } = params;

      requestState.setLoading(true);

      return updatePasswordCallback(user, currentPassword, newPassword).catch(
        (e) => {
          requestState.setError(t(`profile:updatePasswordError`));

          return e;
        }
      );
    },
    [t, user, requestState, updatePasswordCallback]
  );

  // reset form on success
  useEffect(() => {
    if (requestState.state.success) {
      reset();
      requestState.resetState();
    }
  }, [reset, requestState]);

  return (
    <>
      <form data-cy={'update-password-form'} onSubmit={handleSubmit(onSubmit)}>
        <div className={'flex flex-col space-y-4'}>
          <If condition={requestState.state.error}>
            <div data-cy={'update-password-error-alert'}>
              <Alert type={'error'}>{requestState.state.error as string}</Alert>
            </div>
          </If>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:currentPassword'} />

              <TextField.Input
                {...currentPasswordControl}
                data-cy={'current-password'}
                type={'password'}
              />

              <TextField.Error error={errors.currentPassword?.message} />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:newPassword'} />

              <TextField.Input
                {...newPasswordControl}
                data-cy={'new-password'}
                required
                type={'password'}
              />

              <TextField.Error
                data-cy={'new-password-error'}
                error={errors.newPassword?.message}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:repeatPassword'} />

              <TextField.Input
                {...repeatPasswordControl}
                data-cy={'repeat-new-password'}
                required
                type={'password'}
              />
            </TextField.Label>

            <TextField.Error
              data-cy={'repeat-password-error'}
              error={errors.repeatPassword?.message}
            />
          </TextField>

          <div>
            <Button
              className={'w-full md:w-auto'}
              loading={requestState.state.loading}
            >
              <Trans i18nKey={'profile:updatePasswordSubmitLabel'} />
            </Button>
          </div>
        </div>
      </form>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async (credential) => {
              await updatePasswordFromCredential(
                credential,
                getValues('newPassword')
              );

              setMultiFactorAuthError(undefined);
            }}
          />
        )}
      </If>
    </>
  );
};

export default UpdatePasswordForm;
