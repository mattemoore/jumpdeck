import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import toaster from 'react-hot-toast';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';

import useDisableMultiFactorAuthentication from '~/lib/profile/hooks/use-disable-multi-factor-auth';

const DisableMultiFactorButton: React.FC<{
  onDisable: EmptyCallback;
}> = ({ onDisable }) => {
  const { trigger, isMutating } = useDisableMultiFactorAuthentication();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const onDisableSubmit = useCallback(async () => {
    const promise = trigger().then(onDisable);

    return toaster.promise(promise, {
      loading: t(`profile:disablingMfa`),
      error: t(`profile:disableMfaError`),
      success: t(`profile:disableMfaSuccess`),
    });
  }, [trigger, onDisable, t]);

  return (
    <>
      <div>
        <Button
          color={'danger'}
          variant={'flat'}
          onClick={() => setIsModalOpen(true)}
        >
          <span className={'font-medium'}>
            <Trans i18nKey={'profile:disableMfaButtonLabel'} />
          </span>
        </Button>
      </div>

      <Modal
        heading={<Trans i18nKey={'profile:disableMfa'} />}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <div className={'flex flex-col space-y-4'}>
          <div>
            <p>
              <Trans i18nKey={'common:modalConfirmationQuestion'} />
            </p>
          </div>

          <div className={'flex justify-end space-x-2'}>
            <Modal.CancelButton onClick={() => setIsModalOpen(false)} />

            <Button
              color={'danger'}
              loading={isMutating}
              onClick={onDisableSubmit}
            >
              <Trans i18nKey={'profile:confirmDisableMfaButtonLabel'} />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DisableMultiFactorButton;
