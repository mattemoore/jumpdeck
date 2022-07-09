import { FormEvent, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

import { useCreateOrganization } from '~/lib/organizations/hooks/use-create-organization';
import { Organization } from '~/lib/organizations/types/organization';

const CreateOrganizationModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  onCreate: (organization: WithId<Organization>) => void;
}> = ({ isOpen, setIsOpen, onCreate }) => {
  const [createOrganization, createOrganizationState] = useCreateOrganization();
  const { loading, data: newOrganization } = createOrganizationState;
  const { t } = useTranslation();

  const Heading = () => (
    <Trans i18nKey={'organization:createOrganizationModalHeading'} />
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const name = data.get(`name`) as string;
      const promise = createOrganization(name);

      await toast.promise(promise, {
        success: t(`organization:createOrganizationSuccess`),
        error: t(`organization:createOrganizationError`),
        loading: t(`organization:createOrganizationLoading`),
      });

      setIsOpen(false);
    },
    [createOrganization, setIsOpen, t]
  );

  useEffect(() => {
    if (newOrganization) {
      onCreate(newOrganization);
    }
  }, [newOrganization, onCreate]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={<Heading />}>
      <form onSubmit={onSubmit}>
        <div className={'flex flex-col space-y-4'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'organization:organizationNameLabel'} />

              <TextField.Input
                data-cy={'create-organization-name-input'}
                name={'name'}
                required
                placeholder={'ex. IndieCorp'}
              />
            </TextField.Label>
          </TextField>

          <Button
            data-cy={'confirm-create-organization-button'}
            block
            loading={loading}
          >
            <Trans i18nKey={'organization:createOrganizationSubmitLabel'} />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrganizationModal;
