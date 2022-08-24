import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import { Trans } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import InviteMembersForm from '~/components/organizations/InviteMembersForm';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import SettingsTile from '~/components/settings/SettingsTile';

const OrganizationMembersInvitePage: React.FCC = () => {
  return (
    <>
      <Head>
        <title key="title">Invite Members</title>
      </Head>

      <SettingsPageContainer title={'Organization'}>
        <OrganizationSettingsTabs />

        <SettingsContentContainer>
          <SettingsTile>
            <div className={'flex space-x-4'}>
              <Heading type={3}>
                <Trans i18nKey={'organization:inviteMembersPageHeading'} />
              </Heading>

              <div>
                <GoBackToMembersButton />
              </div>
            </div>

            <InviteMembersForm />
          </SettingsTile>
        </SettingsContentContainer>
      </SettingsPageContainer>
    </>
  );
};

export default OrganizationMembersInvitePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function GoBackToMembersButton() {
  return (
    <Button
      size={'small'}
      color={'transparent'}
      href={'/settings/organization/members'}
    >
      <span className={'flex items-center space-x-1'}>
        <ArrowLeftIcon className={'h-4'} />

        <span>
          <Trans i18nKey={'organization:goBackToMembersPage'} />
        </span>
      </span>
    </Button>
  );
}
