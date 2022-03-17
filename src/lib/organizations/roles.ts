import { ListBoxOptionModel } from '~/core/ui/ListBox/ListBox';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

const OWNER = {
  label: 'common:roles.owner.label',
  description: 'common:roles.owner.description',
  value: MembershipRole.Owner,
};

const ADMIN = {
  label: 'common:roles.admin.label',
  description: 'common:roles.admin.description',
  value: MembershipRole.Admin,
};

const MEMBER = {
  label: 'common:roles.member.label',
  description: 'common:roles.member.description',
  value: MembershipRole.Member,
};

const roles: ListBoxOptionModel<MembershipRole>[] = [OWNER, ADMIN, MEMBER];

export default roles;
