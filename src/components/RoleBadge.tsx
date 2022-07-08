import { Trans } from 'next-i18next';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import Badge from '~/core/ui/Badge';
import roles from '~/lib/organizations/roles';

const classNames = {
  [MembershipRole.Owner]:
    'bg-primary-400 text-current font-semibold dark:text-black-500',
  [MembershipRole.Admin]:
    'bg-primary-600 text-current font-semibold dark:text-black-500',
  [MembershipRole.Member]: 'bg-blue-500 text-white font-semibold',
};

const RoleBadge: React.FCC<{
  role: MembershipRole;
}> = ({ role }) => {
  const data = roles.find((item) => item.value === role);

  return (
    <Badge color={'custom'} size={'small'} className={classNames[role]}>
      <span data-cy={'member-role-badge'}>
        <Trans i18nKey={data?.label} />
      </span>
    </Badge>
  );
};

export default RoleBadge;
