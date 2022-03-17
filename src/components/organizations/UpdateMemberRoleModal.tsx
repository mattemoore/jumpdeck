import { useCallback, useState } from 'react';
import toaster from 'react-hot-toast';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import Label from '~/core/ui/Label';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

import MembershipRoleSelector from './MembershipRoleSelector';
import { useUpdateMemberRequest } from '~/lib/organizations/hooks/use-update-member-role';

const UpdateMemberRoleModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: User;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, member }) => {
  const { t } = useTranslation('organization');
  const [role, setRole] = useState<MembershipRole>(memberRole);

  const organization = useCurrentOrganization();
  const organizationId = organization?.id ?? '';

  const [request, state] = useUpdateMemberRequest({
    organizationId,
    targetMemberId: member.uid,
  });

  const onRoleUpdated = useCallback(async () => {
    if (role === memberRole) {
      toaster.error(t('chooseDifferentRoleError'), {
        className: 'chooseDifferentRoleError',
      });

      return;
    }

    const promise = request({ role });

    await toaster.promise(promise, {
      loading: t('updateRoleLoadingMessage'),
      success: t('updateRoleSuccessMessage'),
      error: t('updatingRoleErrorMessage'),
    });

    setIsOpen(false);
  }, [request, role, setIsOpen, t, memberRole]);

  const heading = () => (
    <Trans i18nKey={'organization:updateMemberRoleModalHeading'} />
  );

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-12'}>
        <div className={'flex flex-col space-y-1'}>
          <Label>
            <Trans i18nKey={'organization:memberRoleInputLabel'} />
          </Label>

          <MembershipRoleSelector value={memberRole} onChange={setRole} />
        </div>

        <Button
          data-cy={'confirm-update-member-role'}
          block
          loading={state.loading}
          onClick={onRoleUpdated}
        >
          <Trans i18nKey={'organization:updateRoleSubmitLabel'} />
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateMemberRoleModal;
