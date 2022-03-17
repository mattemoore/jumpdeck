import { useState } from 'react';
import type { User } from 'firebase/auth';

import { MembershipRole } from '~/lib/organizations/types/membership-role';

import OrganizationMemberActionsDropdown from './OrganizationMemberActionsDropdown';
import RemoveOrganizationMemberModal from './RemoveOrganizationMemberModal';
import UpdateMemberRoleModal from './UpdateMemberRoleModal';

const OrganizationMembersActionsContainer: React.FC<{
  targetMember: User;
  role: MembershipRole;
  disabled: boolean;
}> = ({ targetMember, role, disabled }) => {
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isRemovingUser, setIsRemovingUser] = useState(false);

  return (
    <>
      <OrganizationMemberActionsDropdown
        disabled={disabled}
        onRemoveSelected={() => setIsRemovingUser(true)}
        onChangeRoleSelected={() => setIsUpdatingRole(true)}
      />

      <RemoveOrganizationMemberModal
        setIsOpen={setIsRemovingUser}
        isOpen={isRemovingUser}
        member={targetMember}
      />

      <UpdateMemberRoleModal
        setIsOpen={setIsUpdatingRole}
        isOpen={isUpdatingRole}
        member={targetMember}
        memberRole={role}
      />
    </>
  );
};

export default OrganizationMembersActionsContainer;
