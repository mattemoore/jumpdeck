import {
  EmailAuthProvider,
  MultiFactorError,
  reauthenticateWithCredential,
  updateEmail,
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
import { useRequestState } from '~/core/hooks/use-request-state';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';

const UpdateEmailForm: React.FC<{ user: User }> = ({ user }) => {
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>();
  const { t } = useTranslation();
  const [createServerSideSession] = useCreateServerSideSession();
  const requestState = useRequestState<void>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const updateEmailWithCredential = useCallback(
    (credential: UserCredential, email: string) => {
      // then, we update the user's email address
      const promise = updateEmail(credential.user, email)
        .then(() => {
          return createServerSideSession(credential.user);
        })
        .then(() => {
          setErrorMessage(undefined);
        })
        .catch((e) => {
          setErrorMessage(t<string>(`profile:updateEmailError`));

          return e;
        });

      return toast.promise(promise, {
        success: t(`profile:updateEmailSuccess`),
        loading: t(`profile:updateEmailLoading`),
        error: t(`profile:updateEmailError`),
      });
    },
    [createServerSideSession, setErrorMessage, t]
  );

  const currentEmail = user?.email as string;

  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: {
      email: '',
      repeatEmail: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (params: {
      email: string;
      repeatEmail: string;
      password: string;
    }) => {
      const { email, repeatEmail, password } = params;

      if (email !== repeatEmail) {
        const message = t(`profile:emailsNotMatching`);
        setErrorMessage(message);

        return;
      }

      if (email === currentEmail) {
        const message = t(`profile:updatingSameEmail`);
        setErrorMessage(message);

        return;
      }

      requestState.setLoading(true);

      // first, we need to verify that the password is correct
      // by reauthenticating the user
      const emailAuthCredential = EmailAuthProvider.credential(
        currentEmail,
        password
      );

      const promise = reauthenticateWithCredential(user, emailAuthCredential);

      const credential = await promise.catch((e) => {
        // if we hit a MFA error, it means we need to display an MFA modal
        // and request the verification code sent by SMS
        if (isMultiFactorError(e)) {
          setMultiFactorAuthError(e);
        } else {
          // otherwise, it's a simple error, meaning the user wasn't able
          // to authenticate
          setErrorMessage(t<string>(`profile:updateEmailError`));
        }

        requestState.setError(e);
      });

      // if no valid credential was returned, it's that likely we hit an error
      // and therefore we cannot proceed
      if (!credential) {
        return;
      }

      // otherwise, go ahead and update the email
      return await updateEmailWithCredential(credential, email).finally(() => {
        requestState.setData();
      });
    },
    [currentEmail, t, requestState, updateEmailWithCredential, user]
  );

  const emailControl = register('email', {
    value: '',
    required: true,
  });

  const repeatEmailControl = register('repeatEmail', {
    value: '',
    required: true,
  });

  const passwordControl = register('password', {
    value: '',
    required: true,
  });

  // reset the form on success
  useEffect(() => {
    if (requestState.state.success) {
      reset();
      requestState.resetState();
    }
  }, [reset, requestState]);

  return (
    <>
      <form data-cy={'update-email-form'} onSubmit={handleSubmit(onSubmit)}>
        <div className={'flex flex-col space-y-4'}>
          <If condition={errorMessage}>
            <div data-cy={'update-email-error-alert'}>
              <Alert type={'error'}>{errorMessage}</Alert>
            </div>
          </If>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:newEmail'} />

              <TextField.Input
                {...emailControl}
                data-cy={'profile-new-email-input'}
                required
                type={'email'}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:repeatEmail'} />

              <TextField.Input
                {...repeatEmailControl}
                data-cy={'profile-repeat-email-input'}
                name={repeatEmailControl.name}
                required
                type={'email'}
              />
            </TextField.Label>
          </TextField>

          <TextField>
            <TextField.Label>
              <Trans i18nKey={'profile:yourPassword'} />

              <TextField.Input
                {...passwordControl}
                data-cy={'profile-password-input'}
                required
                type={'password'}
                placeholder={''}
              />
            </TextField.Label>
          </TextField>

          <div>
            <Button
              className={'w-full md:w-auto'}
              loading={requestState.state.loading}
            >
              <Trans i18nKey={'profile:updateEmailSubmitLabel'} />
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
              await updateEmailWithCredential(credential, getValues('email'));

              setMultiFactorAuthError(undefined);
              requestState.setData();
            }}
          />
        )}
      </If>
    </>
  );
};

export default UpdateEmailForm;
