import { FormEvent, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import { useCreateOrganization } from '~/lib/organizations/hooks/use-create-organization';

const CreateOrganizationModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  onCreate: (organizationId: string) => void;
}> = ({ isOpen, setIsOpen, onCreate }) => {
  const [createOrganization, createOrganizationState] = useCreateOrganization();
  const { loading } = createOrganizationState;
  const { t } = useTranslation();

  const Heading = useMemo(
    () => <Trans i18nKey={'organization:createOrganizationModalHeading'} />,
    []
  );

  // Report error when user leaves input empty
  const onError = useCallback(() => {
    toast.error(`Please use a valid name`);
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const name = data.get(`name`) as string;

      // Adjust logic for error handling as needed
      const isNameInvalid = !name || name.trim().length === 0;

      if (isNameInvalid) {
        return onError();
      }

      const organizationId = await toast.promise(createOrganization(name), {
        success: t(`organization:createOrganizationSuccess`),
        error: t(`organization:createOrganizationError`),
        loading: t(`organization:createOrganizationLoading`),
      });

      setIsOpen(false);

      if (organizationId) {
        onCreate(organizationId);
      }
    },
    [createOrganization, onCreate, onError, setIsOpen, t]
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={Heading}>
      <form onSubmit={onSubmit}>
        <div className={'flex flex-col space-y-6'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'organization:organizationNameLabel'} />

              <TextField.Input
                data-cy={'create-organization-name-input'}
                name={'name'}
                minLength={1}
                required
                placeholder={'ex. IndieCorp'}
              />
            </TextField.Label>
          </TextField>

          <div>
            <div className={'flex justify-end space-x-2'}>
              <Modal.CancelButton onClick={() => setIsOpen(false)} />

              <Button
                data-cy={'confirm-create-organization-button'}
                variant={'flat'}
                loading={loading}
              >
                <Trans i18nKey={'organization:createOrganizationSubmitLabel'} />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrganizationModal;
