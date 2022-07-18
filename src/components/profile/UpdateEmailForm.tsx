import { User } from 'firebase/auth';
import { FormEvent, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import { useUpdateUserEmail } from '~/lib/profile/hooks/use-update-user-email';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

const UpdateEmailForm: React.FC<{ user: User }> = ({ user }) => {
  const [errorMessage, setErrorMessage] = useState<Maybe<string>>();
  const [updateEmail, state] = useUpdateUserEmail();
  const { t } = useTranslation();

  const currentEmail = user?.email as string;

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);

      const email = (data.get('email') as string) ?? null;
      const repeatEmail = (data.get('repeatEmail') as string) ?? null;
      const password = (data.get('password') as string) ?? null;

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
      });

      await toast.promise(promise, {
        success: t(`profile:updateEmailSuccess`),
        loading: t(`profile:updateEmailLoading`),
        error: t(`profile:updateEmailError`),
      });
    },
    [currentEmail, t, updateEmail]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className={'flex flex-col space-y-4'}>
        <If condition={errorMessage}>
          <Alert type={'error'}>{errorMessage}</Alert>
        </If>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:newEmail'} />

            <TextField.Input
              required
              type={'email'}
              name={'email'}
              placeholder={'your@email.com'}
              defaultValue={user?.email ?? ''}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:repeatEmail'} />

            <TextField.Input required type={'email'} name={'repeatEmail'} />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'profile:yourPassword'} />

            <TextField.Input
              required
              type={'password'}
              name={'password'}
              placeholder={'Password'}
            />
          </TextField.Label>
        </TextField>

        <Button loading={state.loading} block>
          <Trans i18nKey={'profile:updateEmailSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

export default UpdateEmailForm;
