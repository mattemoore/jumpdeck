import { User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import { useUpdateUserEmail } from '~/lib/profile/hooks/use-update-user-email';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import { useForm } from 'react-hook-form';

const UpdateEmailForm: React.FC<{ user: User }> = ({ user }) => {
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>();
  const [updateEmail, state] = useUpdateUserEmail();
  const { t } = useTranslation();

  const currentEmail = user?.email as string;

  const { register, handleSubmit, reset } = useForm({
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

      const promise = updateEmail({
        oldEmail: currentEmail,
        email,
        password,
      })
        .then(() => {
          setErrorMessage(undefined);
        })
        .catch((e) => {
          setErrorMessage(t(`profile:updateEmailError`));

          return e;
        });

      await toast.promise(promise, {
        success: t(`profile:updateEmailSuccess`),
        loading: t(`profile:updateEmailLoading`),
        error: t(`profile:updateEmailError`),
      });
    },
    [currentEmail, t, updateEmail]
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

  useEffect(() => {
    if (state.success) {
      reset();
    }
  }, [state.success, reset]);

  return (
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
              data-cy={'profile-new-email-input'}
              name={emailControl.name}
              onChange={emailControl.onChange}
              onBlur={emailControl.onBlur}
              innerRef={emailControl.ref}
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
              data-cy={'profile-repeat-email-input'}
              name={repeatEmailControl.name}
              onChange={repeatEmailControl.onChange}
              onBlur={repeatEmailControl.onBlur}
              innerRef={repeatEmailControl.ref}
              required
              type={'email'}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:yourPassword'} />

            <TextField.Input
              data-cy={'profile-password-input'}
              required
              type={'password'}
              name={passwordControl.name}
              onChange={passwordControl.onChange}
              onBlur={passwordControl.onBlur}
              innerRef={passwordControl.ref}
              placeholder={''}
            />
          </TextField.Label>
        </TextField>

        <div>
          <Button loading={state.loading}>
            <Trans i18nKey={'profile:updateEmailSubmitLabel'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateEmailForm;
