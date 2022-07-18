import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import { Trans } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import InviteMembersForm from '~/components/organizations/InviteMembersForm';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import SettingsPageContainer from '~/components/SettingsPageContainer';

const OrganizationMembersInvitePage: React.FCC = () => {
  return (
    <SettingsPageContainer title={'Organization'}>
      <Head>
        <title key="title">Invite Members</title>
      </Head>

      <div className={'flex justify-between'}>
        <OrganizationSettingsTabs />

        <div className={'w-full md:w-9/12'}>
          <div className={'flex flex-col space-y-4'}>
            <div className={'flex space-x-4'}>
              <Heading type={3}>
                <Trans i18nKey={'organization:inviteMembersPageHeading'} />
              </Heading>

              <div>
                <Button
                  size={'small'}
                  color={'transparent'}
                  href={'/settings/organization/members'}
                >
                  <span className={'flex items-center space-x-1'}>
                    <ArrowNarrowLeftIcon className={'h-4'} />
                    <span>
                      <Trans i18nKey={'organization:goBackToMembersPage'} />
                    </span>
                  </span>
                </Button>
              </div>
            </div>

            <InviteMembersForm />
          </div>
        </div>
      </div>
    </SettingsPageContainer>
  );
};

export default OrganizationMembersInvitePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
