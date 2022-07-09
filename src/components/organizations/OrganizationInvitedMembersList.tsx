import { Trans } from 'next-i18next';
import { SelfBuildingSquareSpinner } from 'react-epic-spinners';

import If from '~/core/ui/If';
import Badge from '~/core/ui/Badge';

import { useFetchOrganization } from '~/lib/organizations/hooks/use-fetch-organization';
import { canUpdateUser } from '~/lib/organizations/permissions';
import { useCurrentUserRole } from '~/lib/organizations/hooks/use-current-user-role';
import { useFetchOrganizationMembersMetadata } from '~/lib/organizations/hooks/use-fetch-members-metadata';
import { Organization } from '~/lib/organizations/types/organization';

import { useUserId } from '~/lib/hooks/use-user-id';

import OrganizationMembersActionsContainer from './OrganizationMembersActionsContainer';
import RoleBadge from '../RoleBadge';
import ProfileAvatar from '../ProfileAvatar';

const OrganizationMembersList: React.FCC<{
  organizationId: string;
}> = ({ organizationId }) => {
  const userId = useUserId();
  const userRole = useCurrentUserRole();

  // fetch the organization members
  // and re-render on changes
  const { data: organization, status } = useFetchOrganization(organizationId);

  // fetch the metadata from the admin
  // so that we can display email/name and profile picture
  const { data: membersMetadata, loading } =
    useFetchOrganizationMembersMetadata(organizationId);

  const isLoading = status === 'loading' || loading;

  if (isLoading) {
    return (
      <div className={'flex items-center justify-center'}>
        <SelfBuildingSquareSpinner />
      </div>
    );
  }

  if (userRole === undefined) {
    return null;
  }

  const members = getSortedMembers(organization);

  return (
    <div className={'w-full space-y-10'}>
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-black-300">
        {members.map(({ role, id: memberId }) => {
          const metadata = membersMetadata?.find((metadata) => {
            return metadata.uid === memberId;
          });

          if (!metadata) {
            return null;
          }

          const displayName = metadata.displayName
            ? metadata.displayName
            : metadata.email;

          const isCurrentUser = userId === metadata.uid;

          // check if user has the permissions to update another member of
          // the organization. If it returns false, the actions' dropdown
          // should be disabled
          const shouldEnableActions = canUpdateUser(userRole, role);

          return (
            <div
              key={metadata.uid}
              data-cy={'organization-member'}
              className={'flex items-center space-x-2 py-3'}
            >
              <div className={'flex flex-auto items-center space-x-4'}>
                <ProfileAvatar user={metadata} />

                <div className={'block truncate text-sm'}>{displayName}</div>

                <If condition={isCurrentUser}>
                  <Badge>
                    <Trans i18nKey={'organization:youBadgeLabel'} />
                  </Badge>
                </If>
              </div>

              <div className={'flex items-center justify-end space-x-4'}>
                <div>
                  <RoleBadge role={role} />
                </div>

                <OrganizationMembersActionsContainer
                  disabled={!shouldEnableActions}
                  targetMember={metadata}
                  role={role}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationMembersList;

/**
 * @description Return the list of members sorted by role {@link MembershipRole}
 * @param organization
 */
function getSortedMembers(organization: WithId<Organization>) {
  console.log(organization);
  const membersIds = Object.keys(organization.members);

  return membersIds
    .map((memberId) => {
      const member = organization.members[memberId];

      return {
        ...member,
        id: memberId,
      };
    })
    .sort((prev, next) => {
      return next.role > prev.role ? 1 : -1;
    });
}
