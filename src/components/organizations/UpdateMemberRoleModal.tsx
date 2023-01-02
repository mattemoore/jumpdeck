import { useCallback, useMemo, useState } from 'react';
import toaster from 'react-hot-toast';
import type { User } from 'firebase/auth';
import { Trans, useTranslation } from 'next-i18next';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import RadioGroup from '~/core/ui/RadioGroup';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';
import { useUpdateMemberRequest } from '~/lib/organizations/hooks/use-update-member-role';
import rolesModel from '~/lib/organizations/roles';
import { ListBoxOptionModel } from '~/core/ui/ListBox/ListBox';

const UpdateMemberRoleModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: User;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, member }) => {
  const { t } = useTranslation('organization');
  const [role, setRole] = useState<ListBoxOptionModel<MembershipRole>>();

  const organization = useCurrentOrganization();
  const organizationId = organization?.id ?? '';

  const { trigger, isMutating } = useUpdateMemberRequest({
    organizationId,
    targetMemberId: member.uid,
  });

  const onRoleUpdated = useCallback(async () => {
    if (!role || role.value === memberRole) {
      return toaster.error(t('chooseDifferentRoleError'), {
        className: 'chooseDifferentRoleError',
      });
    }

    const promise = trigger({ role: role.value });

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

  const roles = useEligibleRoles(memberRole);

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-4'}>
        <RoleSelectorRadio roles={roles} value={role} setValue={setRole} />

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            disabled={!role}
            data-cy={'confirm-update-member-role'}
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

function RoleSelectorRadio(
  props: React.PropsWithChildren<{
    roles: Array<ListBoxOptionModel<MembershipRole>>;
    value: Maybe<ListBoxOptionModel<MembershipRole>>;
    setValue: (value: ListBoxOptionModel<MembershipRole>) => void;
  }>
) {
  return (
    <RadioGroup value={props.value} setValue={props.setValue}>
      {props.roles.map((role) => {
        return (
          <RadioGroup.Option
            data-cy={`update-role-option-${role.value}`}
            item={role}
            key={role.value}
          />
        );
      })}
    </RadioGroup>
  );
}

export default UpdateMemberRoleModal;

/**
 * @name useEligibleRoles
 * @description Returns a list of roles that are eligible for the current
 * user to assign to another user. By default, we exclude the owner role.
 * @param memberRole
 */
function useEligibleRoles(memberRole: MembershipRole) {
  return useMemo(() => {
    return rolesModel.filter(
      (item) => item.value !== memberRole && item.value !== MembershipRole.Owner
    );
  }, [memberRole]);
}
