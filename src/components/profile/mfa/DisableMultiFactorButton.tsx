import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import toaster from 'react-hot-toast';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';

import useDisableMultiFactorAuthentication from '~/lib/profile/hooks/use-disable-multi-factor-auth';

const DisableMultiFactorButton: React.FC<{
  onDisable: EmptyCallback;
}> = ({ onDisable }) => {
  const [disableMultiFactorAuthentication, { loading }] =
    useDisableMultiFactorAuthentication();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const onDisableSubmit = useCallback(async () => {
    const promise = disableMultiFactorAuthentication().then(onDisable);

    return toaster.promise(promise, {
      loading: t(`profile:disablingMfa`),
      error: t(`profile:disableMfaError`),
      success: t(`profile:disableMfaSuccess`),
    });
  }, [disableMultiFactorAuthentication, onDisable, t]);

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

          <Button
            color={'danger'}
            block
            loading={loading}
            onClick={onDisableSubmit}
          >
            <Trans i18nKey={'profile:confirmDisableMfaButtonLabel'} />
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DisableMultiFactorButton;
