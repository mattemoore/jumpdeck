import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

import { useUserCanInviteUsers } from '~/lib/organizations/hooks/use-user-can-invite-users';
import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';

import Heading from '~/core/ui/Heading';
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
    <>
      <Head>
        <title key="title">Organization Members</title>
      </Head>

      <SettingsPageContainer title={'Organization'}>
        <OrganizationSettingsTabs />

        <SettingsContentContainer>
          <div className="flex flex-1 flex-col space-y-4">
            <SettingsTile>
              <div className="flex items-center justify-between space-x-8">
                <Heading type={3}>
                  <Trans i18nKey={'organization:membersPageHeading'} />
                </Heading>

                <If condition={canInviteUsers}>
                  <InviteMembersButton />
                </If>
              </div>

              <OrganizationMembersList organizationId={id} />
            </SettingsTile>

            <SettingsTile>
              <Heading type={3}>
                <Trans i18nKey={'organization:pendingInvitesHeading'} />
              </Heading>

              <OrganizationInvitedMembersList organizationId={id} />
            </SettingsTile>
          </div>
        </SettingsContentContainer>
      </SettingsPageContainer>
    </>
  );
};

export default OrganizationMembersPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return withAppProps(ctx);
}

function InviteMembersButton() {
  return (
    <Button
      data-cy={'invite-form-link'}
      type="button"
      href={'/settings/organization/members/invite'}
    >
      <span className="flex items-center space-x-2">
        <PlusIcon className="h-5" />

        <span>
          <Trans i18nKey={'organization:inviteMembersButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}
