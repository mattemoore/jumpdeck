import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { UserPlusIcon } from '@heroicons/react/24/outline';

import { useUserCanInviteUsers } from '~/lib/organizations/hooks/use-user-can-invite-users';
import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';

import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';

const OrganizationMembersList = dynamic(
  () => import('~/components/organizations/OrganizationMembersList'),
  {
    ssr: false,
  }
);

const OrganizationInvitedMembersList = dynamic(
  () => import('~/components/organizations/OrganizationInvitedMembersList'),
  {
    ssr: false,
  }
);

const OrganizationMembersPage: React.FCC = () => {
  const canInviteUsers = useUserCanInviteUsers();
  const organization = useCurrentOrganization();
  const id = organization?.id as string;

  if (!id) {
    return null;
  }

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key="title">Organization Members</title>
      </Head>

      <OrganizationSettingsTabs />

      <SettingsContentContainer>
        <div className="flex flex-1 flex-col space-y-6">
          <SettingsTile
            heading={<Trans i18nKey={'organization:membersTabLabel'} />}
            subHeading={<Trans i18nKey={'organization:membersTabSubheading'} />}
            actions={
              <If condition={canInviteUsers}>
                <InviteMembersButton />
              </If>
            }
          >
            <OrganizationMembersList organizationId={id} />
          </SettingsTile>

          <SettingsTile
            heading={<Trans i18nKey={'organization:pendingInvitesHeading'} />}
            subHeading={
              <Trans i18nKey={'organization:pendingInvitesSubheading'} />
            }
          >
            <OrganizationInvitedMembersList organizationId={id} />
          </SettingsTile>
        </div>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

export default OrganizationMembersPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return withAppProps(ctx);
}

function InviteMembersButton() {
  return (
    <Button
      size={'small'}
      className={'w-full lg:w-auto'}
      data-cy={'invite-form-link'}
      type="button"
      href={'/settings/organization/members/invite'}
    >
      <span className="flex items-center space-x-2">
        <UserPlusIcon className="h-5" />

        <span>
          <Trans i18nKey={'organization:inviteMembersButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}
