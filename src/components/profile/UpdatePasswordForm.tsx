import { User } from 'firebase/auth';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import { useUpdatePassword } from '~/lib/profile/hooks/use-update-password';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

const UpdatePasswordForm: React.FC<{ user: User }> = ({ user }) => {
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>();
  const [updatePassword, { loading }] = useUpdatePassword();
  const { t } = useTranslation();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const newPassword = (data.get('newPassword') as string) ?? null;
    const repeatPassword = (data.get('repeatPassword') as string) ?? null;

    if (newPassword !== repeatPassword) {
      const message = t(`profile.passwordNotMatching`);
      setErrorMessage(message);

      return;
    }

    const promise = updatePassword(user, newPassword);

    await toast.promise(promise, {
      success: t(`profile:updatePasswordSuccess`),
      error: t(`profile:updatePasswordError`),
      loading: t(`profile:updatePasswordLoading`),
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={'flex flex-col space-y-4'}>
        <If condition={errorMessage}>
          <Alert type={'error'}>{errorMessage}</Alert>
        </If>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:currentPassword'} />

            <TextField.Input required type={'password'} name={'oldPassword'} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:newPassword'} />

            <TextField.Input required type={'password'} name={'newPassword'} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:repeatPassword'} />

            <TextField.Input
              required
              type={'password'}
              name={'repeatPassword'}
            />
          </TextField.Label>
        </TextField>

        <Button loading={loading} block>
          <Trans i18nKey={'profile:updatePasswordSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
