import { Trans } from 'next-i18next';

import { useFetchInvitedMembers } from '~/lib/organizations/hooks/use-fetch-invited-members';
import FallbackUserAvatar from '../FallbackUserAvatar';
import RoleBadge from '../RoleBadge';
import DeleteInviteButton from './DeleteInviteButton';
import { IfHasPermissions } from '~/components/IfHasPermissions';
import { canDeleteInvites } from '~/lib/organizations/permissions';

const OrganizationInvitedMembersList: React.FC<{
  organizationId: string;
}> = ({ organizationId }) => {
  const { data: members, status } = useFetchInvitedMembers(organizationId);

  if (status === 'loading') {
    return <Trans i18nKey={'organization:loadingMembers'} />;
  }

  if (!members.length) {
    return (
      <p className={'text-sm'}>
        <Trans i18nKey={'organization:noPendingInvites'} />
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 dark:divide-black-400">
      {(members ?? []).map(({ email, role, code, id }) => {
        return (
          <div
            key={id}
            data-cy={'invited-member'}
            data-code={code}
            className={'flex space-x-2 items-center py-3'}
          >
            <div className={'flex flex-auto space-x-4 items-center'}>
              <FallbackUserAvatar text={email} />

              <div className={'truncate block text-sm'}>{email}</div>
            </div>

            <div className={'justify-end flex space-x-4 items-center'}>
              <RoleBadge role={role} />

              <IfHasPermissions condition={canDeleteInvites}>
                <DeleteInviteButton
                  inviteId={id}
                  organizationId={organizationId}
                  memberEmail={email}
                />
              </IfHasPermissions>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrganizationInvitedMembersList;
