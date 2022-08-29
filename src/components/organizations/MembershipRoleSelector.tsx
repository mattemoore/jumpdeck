import ListBox from '~/core/ui/ListBox/ListBox';
import ListBoxOption from '~/core/ui/ListBox/ListBoxOption';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import roles from '~/lib/organizations/roles';
import { IfHasPermissions } from '~/components/IfHasPermissions';
import { canInviteUser } from '~/lib/organizations/permissions';

const MembershipRoleSelector: React.FCC<{
  value?: MembershipRole;
  onChange?: (role: MembershipRole) => unknown;
}> = ({ value: currentRole, onChange }) => {
  const selectedRole = getSelectedRoleModel(currentRole);

  return (
    <ListBox
      value={selectedRole}
      setValue={(role) => {
        onChange && onChange(role.value);
      }}
      cy={'invite-role-selector-button'}
    >
      {roles.map((role) => {
        return (
          <IfHasPermissions
            key={role.value}
            condition={(currentUserRole) =>
              canInviteUser(currentUserRole, role.value)
            }
          >
            <ListBoxOption option={role} />
          </IfHasPermissions>
        );
      })}
    </ListBox>
  );
};

function getSelectedRoleModel(currentRole: MembershipRole | undefined) {
  const memberRole = roles[2];

  return (
    roles.find((role) => {
      return role.value === currentRole;
    }) ?? memberRole
  );
}

export default MembershipRoleSelector;
