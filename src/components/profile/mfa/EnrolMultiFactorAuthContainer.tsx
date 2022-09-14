import { useCallback, useRef, useState } from 'react';
import { Trans } from 'next-i18next';
import { useAuth } from 'reactfire';

import Modal from '~/core/ui/Modal';
import If from '~/core/ui/If';

import MultiFactorAuthPhoneNumberForm from '~/components/profile/mfa/MultiFactorAuthPhoneNumberForm';
import MultiFactorAuthVerificationCodeForm from '~/components/profile/mfa/VerificationCodeForm';
import ReauthenticationForm from '~/components/auth/ReauthenticationForm';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';

enum Status {
  Reauthenticate,
  PhoneNumberForm,
  VerificationCodeForm,
}

const EnrolMultiFactorAuthContainer: React.FC<{
  onComplete: (success: boolean) => void;
}> = ({ onComplete }) => {
  const auth = useAuth();
  const [createServerSideSession] = useCreateServerSideSession();
  const [status, setStatus] = useState<Status>(Status.PhoneNumberForm);
  const verificationIdRef = useRef<string>();

  const onSuccessfulEnrollment = useCallback(async () => {
    const user = await auth.currentUser;

    if (user) {
      await createServerSideSession(user);
    }
  }, [createServerSideSession, auth]);

  return (
    <Modal
      heading={<Trans i18nKey={'profile:multiFactorAuth'} />}
      isOpen={true}
      setIsOpen={() => onComplete(false)}
    >
      <If condition={status === Status.Reauthenticate}>
        <div className={'my-4'}>
          <p>
            <Trans i18nKey={'auth:reauthenticateDescription'} />
          </p>
        </div>

        <ReauthenticationForm
          onSuccess={() => setStatus(Status.PhoneNumberForm)}
        />
      </If>

      <If condition={status === Status.PhoneNumberForm}>
        <MultiFactorAuthPhoneNumberForm
          onReauthenticateError={() => {
            setStatus(Status.Reauthenticate);
          }}
          onComplete={(verificationId) => {
            verificationIdRef.current = verificationId;
            setStatus(Status.VerificationCodeForm);
          }}
        />
      </If>

      <If condition={status === Status.VerificationCodeForm}>
        <If condition={verificationIdRef.current}>
          {(verificationId) => {
            return (
              <MultiFactorAuthVerificationCodeForm
                verificationId={verificationId}
                onComplete={async (isSuccessful) => {
                  if (isSuccessful) {
                    await onSuccessfulEnrollment();
                  }

                  onComplete(isSuccessful);
                }}
              />
            );
          }}
        </If>
      </If>
    </Modal>
  );
};

export default EnrolMultiFactorAuthContainer;
