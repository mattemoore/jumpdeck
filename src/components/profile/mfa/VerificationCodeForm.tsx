import { FormEventHandler, useCallback } from 'react';
import { Trans, useTranslation } from 'next-i18next';

import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from 'firebase/auth';

import toaster from 'react-hot-toast';
import { useAuth } from 'reactfire';

import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useRequestState } from '~/core/hooks/use-request-state';

const MultiFactorAuthVerificationCodeForm: React.FC<{
  verificationId: string;
  onComplete: (success: boolean) => void;
}> = ({ onComplete, verificationId }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const requestState = useRequestState<void>();
  const user = auth.currentUser;

  const onEnrolRequested = useCallback(
    async (params: { verificationCode: string; authFactorName: string }) => {
      if (!user || requestState.state.loading) {
        return;
      }

      requestState.setLoading(true);

      const { verificationCode, authFactorName } = params;

      const phoneAuthCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

      const displayName = authFactorName ?? null;

      const promise = multiFactor(user)
        .enroll(multiFactorAssertion, displayName)
        .then(() => {
          const success = true;
          onComplete(success);
        })
        .catch((error) => {
          requestState.setError(error);

          throw error.code;
        });

      return await toaster.promise(promise, {
        success: t(`profile:mfaEnabledSuccessTitle`),
        error: t(`profile:verificationCodeError`),
        loading: t(`profile:mfaActivationLoading`),
      });
    },
    [verificationId, t, onComplete, user, requestState]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      const data = new FormData(e.currentTarget);
      const verificationCode = data.get('verificationCode') as string;
      const authFactorName = data.get('authFactorName') as string;

      return onEnrolRequested({ verificationCode, authFactorName });
    },
    [onEnrolRequested]
  );

  return (
    <form onSubmit={onSubmit}>
      <div className={'mb-2.5 text-gray-400 dark:text-gray-400'}>
        <Trans i18nKey={'profile:verifyActivationCodeDescription'} />
      </div>

      <div className={'flex flex-col space-y-3'}>
        <TextField.Label>
          <Trans i18nKey={'profile:verificationCode'} />
          <TextField.Input
            required
            autoComplete={'off'}
            name={'verificationCode'}
          />
        </TextField.Label>

        <TextField.Label>
          <Trans i18nKey={'profile:authFactorName'} />
          <TextField.Input name={'authFactorName'} />
          <TextField.Hint>
            <Trans i18nKey={'profile:authFactorNameHint'} />
          </TextField.Hint>
        </TextField.Label>

        <Button block type={'submit'} loading={requestState.state.loading}>
          <Trans i18nKey={'profile:verifyActivationCodeSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

export default MultiFactorAuthVerificationCodeForm;
