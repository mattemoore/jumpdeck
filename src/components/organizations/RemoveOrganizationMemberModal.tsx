import toaster from 'react-hot-toast';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';

import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';
import { useApiRequest } from '~/core/hooks/use-api';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import { useCallback } from 'react';

const RemoveOrganizationMemberModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: User;
}> = ({ isOpen, setIsOpen, member }) => {
  const organization = useCurrentOrganization();
  const organizationId = organization?.id as string;
  const { t } = useTranslation('organization');

  const [removeMemberRequest, state] = useRemoveMemberRequest(
    organizationId,
    member.uid
  );

  const onUserRemoved = useCallback(() => {
    void (async () => {
      const promise = removeMemberRequest();

      await toaster.promise(promise, {
        success: t(`removeMemberSuccessMessage`),
        error: t(`removeMemberErrorMessage`),
        loading: t(`removeMemberLoadingMessage`),
      });

      setIsOpen(false);
    })();
  }, [removeMemberRequest, setIsOpen, t]);

  const heading = <Trans i18nKey="organization:removeMemberModalHeading" />;

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-4'}>
        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <Button
          block
          data-cy={'confirm-remove-member'}
          color={'danger'}
          onClick={onUserRemoved}
          loading={state.loading}
        >
          <Trans i18nKey={'organization:removeMemberSubmitLabel'} />
        </Button>
      </div>
    </Modal>
  );
};

function useRemoveMemberRequest(organizationId: string, targetMember: string) {
  return useApiRequest(
    `/api/organizations/${organizationId}/members/${targetMember}`,
    'DELETE'
  );
}

export default RemoveOrganizationMemberModal;
