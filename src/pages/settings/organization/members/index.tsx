import { GetServerSidePropsContext } from 'next';
import UserAddIcon from '@heroicons/react/outline/UserAddIcon';
import { Trans } from 'next-i18next';
import Head from 'next/head';

import { useUserCanInviteUsers } from '~/lib/organizations/hooks/use-user-can-invite-users';
import { OrganizationContext } from '~/lib/contexts/organization';
import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationMembersList from '~/components/organizations/OrganizationMembersList';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import OrganizationInvitedMembersList from '~/components/organizations/OrganizationInvitedMembersList';

import RouteShell from '~/components/RouteShell';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import ClientOnly from '~/core/ui/ClientOnly';

const OrganizationMembersPage: React.FC = () => {
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
                  <div className="flex space-x-8 items-center justify-between">
                    <Heading type={3}>
                      <Trans i18nKey={'organization:membersPageHeading'} />
                    </Heading>

                    <If condition={canInviteUsers}>
                      <Button
                        data-cy={'invite-form-link'}
                        type="button"
                        href={'/settings/organization/members/invite'}
                      >
                        <span className="flex space-x-2 items-center">
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

                  <ClientOnly>
                    <OrganizationMembersList organizationId={id} />
                  </ClientOnly>
                </div>

                <div className={'flex flex-col space-y-2'}>
                  <Heading type={3}>
                    <Trans i18nKey={'organization:pendingInvitesHeading'} />
                  </Heading>

                  <ClientOnly>
                    <OrganizationInvitedMembersList organizationId={id} />
                  </ClientOnly>
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
