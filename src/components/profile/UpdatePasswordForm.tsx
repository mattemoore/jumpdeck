import { User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { useUpdatePassword } from '~/lib/profile/hooks/use-update-password';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

const UpdatePasswordForm: React.FCC<{ user: User }> = ({ user }) => {
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>();
  const [updatePassword, { loading, success }] = useUpdatePassword();
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (params: {
      currentPassword: string;
      newPassword: string;
      repeatPassword: string;
    }) => {
      const { newPassword, currentPassword, repeatPassword } = params;

      if (currentPassword === newPassword) {
        const message = t(`profile:passwordNotChanged`);
        setErrorMessage(message);

        return;
      }

      if (newPassword !== repeatPassword) {
        const message = t(`profile:passwordNotMatching`);
        setErrorMessage(message);

        return;
      }

      const promise = updatePassword(user, currentPassword, newPassword)
        .then(() => {
          setErrorMessage(undefined);
        })
        .catch((e) => {
          setErrorMessage(t(`profile:updatePasswordError`));

          return e;
        });

      await toast.promise(promise, {
        success: t(`profile:updatePasswordSuccess`),
        error: t(`profile:updatePasswordError`),
        loading: t(`profile:updatePasswordLoading`),
      });
    },
    [t, updatePassword, user]
  );

  const currentPasswordControl = register('currentPassword', {
    value: '',
    required: true,
  });

  const newPasswordControl = register('newPassword', {
    value: '',
    required: true,
  });

  const repeatPasswordControl = register('repeatPassword', {
    value: '',
    required: true,
  });

  useEffect(() => {
    if (success) {
      reset();
    }
  }, [success, reset]);

  return (
    <form data-cy={'update-password-form'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col space-y-4'}>
        <If condition={errorMessage}>
          <div data-cy={'update-password-error-alert'}>
            <Alert type={'error'}>{errorMessage}</Alert>
          </div>
        </If>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:currentPassword'} />

            <TextField.Input
              data-cy={'current-password'}
              required
              type={'password'}
              name={currentPasswordControl.name}
              innerRef={currentPasswordControl.ref}
              onChange={currentPasswordControl.onChange}
              onBlur={currentPasswordControl.onBlur}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:newPassword'} />

            <TextField.Input
              data-cy={'new-password'}
              required
              type={'password'}
              name={newPasswordControl.name}
              innerRef={newPasswordControl.ref}
              onChange={newPasswordControl.onChange}
              onBlur={newPasswordControl.onBlur}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:repeatPassword'} />

            <TextField.Input
              data-cy={'repeat-new-password'}
              required
              type={'password'}
              name={repeatPasswordControl.name}
              innerRef={repeatPasswordControl.ref}
              onChange={repeatPasswordControl.onChange}
              onBlur={repeatPasswordControl.onBlur}
            />
          </TextField.Label>
        </TextField>

        <div>
          <Button loading={loading}>
            <Trans i18nKey={'profile:updatePasswordSubmitLabel'} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
