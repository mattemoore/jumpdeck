import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import UserAddIcon from '@heroicons/react/outline/UserAddIcon';

import { useUserCanInviteUsers } from '~/lib/organizations/hooks/use-user-can-invite-users';
import { OrganizationContext } from '~/lib/contexts/organization';
import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';

import RouteShell from '~/components/RouteShell';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

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

  return (
    <RouteShell title={'Organization'}>
      <Head>
        <title key="title">Organization Members</title>
      </Head>

      <OrganizationContext.Consumer>
        {({ organization }) => {
          const id = organization?.id as string;

          return (
            <div className={'flex space-x-12'}>
              <OrganizationSettingsTabs />

              <div className="flex flex-1 flex-col space-y-8">
                <div>
                  <div className="flex items-center justify-between space-x-8">
                    <Heading type={3}>
                      <Trans i18nKey={'organization:membersPageHeading'} />
                    </Heading>

                    <If condition={canInviteUsers}>
                      <Button
                        data-cy={'invite-form-link'}
                        type="button"
                        href={'/settings/organization/members/invite'}
                      >
                        <span className="flex items-center space-x-2">
                          <UserAddIcon className="h-5" />

                          <span>
                            <Trans
                              i18nKey={'organization:inviteMembersButtonLabel'}
                            />
                          </span>
                        </span>
                      </Button>
                    </If>
                  </div>

                  <OrganizationMembersList organizationId={id} />
                </div>

                <div className={'flex flex-col space-y-2'}>
                  <Heading type={3}>
                    <Trans i18nKey={'organization:pendingInvitesHeading'} />
                  </Heading>

                  <OrganizationInvitedMembersList organizationId={id} />
                </div>
              </div>
            </div>
          );
        }}
      </OrganizationContext.Consumer>
    </RouteShell>
  );
};

export default OrganizationMembersPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return withAppProps(ctx);
}
