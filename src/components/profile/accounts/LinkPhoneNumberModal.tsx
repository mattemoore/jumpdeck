import { Trans } from 'next-i18next';
import Modal from '~/core/ui/Modal';
import PhoneNumberCredentialForm from '~/components/auth/PhoneNumberCredentialForm';

function LinkPhoneNumberModal({
  isOpen,
  setIsOpen,
  onSuccess,
}: React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: (phoneNumber: string) => void;
}>) {
  return (
    <Modal
      heading={<Trans i18nKey={'profile:linkPhoneNumber'} />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <PhoneNumberCredentialForm
        action={'link'}
        onSuccess={(credential) => {
          if (onSuccess) {
            const phoneNumber = credential.user.phoneNumber;

            // adding condition for type-safety but this
            // should always be the case
            if (phoneNumber) {
              onSuccess(phoneNumber);
            }
          }

          setIsOpen(false);
        }}
      />
    </Modal>
  );
}

export default LinkPhoneNumberModal;
