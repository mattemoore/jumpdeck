import { useCallback, useState } from 'react';
import toaster from 'react-hot-toast';
import { Trans, useTranslation } from 'next-i18next';
import type { User } from 'firebase/auth';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';
import { useUpdateMemberRequest } from '~/lib/organizations/hooks/use-update-member-role';
import MembershipRoleSelector from '~/components/organizations/MembershipRoleSelector';

const UpdateMemberRoleModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: User;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, member }) => {
  const { t } = useTranslation('organization');
  const [role, setRole] = useState<MembershipRole>(memberRole);

  const organization = useCurrentOrganization();
  const organizationId = organization?.id ?? '';

  const { trigger, isMutating } = useUpdateMemberRequest({
    organizationId,
    targetMemberId: member.uid,
  });

  const onRoleUpdated = useCallback(async () => {
    if (role === undefined || role === memberRole) {
      return toaster.error(t('chooseDifferentRoleError'), {
        className: 'chooseDifferentRoleError',
      });
    }

    const promise = trigger({ role });

    await toaster.promise(promise, {
      loading: t('updateRoleLoadingMessage'),
      success: t('updateRoleSuccessMessage'),
      error: t('updatingRoleErrorMessage'),
    });

    setIsOpen(false);
  }, [trigger, role, setIsOpen, t, memberRole]);

  const heading = (
    <Trans i18nKey={'organization:updateMemberRoleModalHeading'} />
  );

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-6'}>
        <MembershipRoleSelector value={role} onChange={setRole} />

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            data-cy={'confirm-update-member-role'}
            variant={'flat'}
            loading={isMutating}
            onClick={onRoleUpdated}
          >
            <Trans i18nKey={'organization:updateRoleSubmitLabel'} />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMemberRoleModal;
