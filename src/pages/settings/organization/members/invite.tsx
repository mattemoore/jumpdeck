import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

import { withAppProps } from '~/lib/props/with-app-props';

import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';
import InviteMembersForm from '~/components/organizations/InviteMembersForm';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';

import Button from '~/core/ui/Button';
import SettingsTile from '~/components/settings/SettingsTile';

const OrganizationMembersInvitePage: React.FCC = () => {
  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key="title">Invite Members</title>
      </Head>

      <OrganizationSettingsTabs />

      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'organization:inviteMembersPageHeading'} />}
          subHeading={
            <Trans i18nKey={'organization:inviteMembersPageSubheading'} />
          }
        >
          <InviteMembersForm />
        </SettingsTile>

        <div className={'mt-4'}>
          <GoBackToMembersButton />
        </div>
      </SettingsContentContainer>
    </SettingsPageContainer>
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
        <ArrowLeftIcon className={'h-3'} />

        <span>
          <Trans i18nKey={'organization:goBackToMembersPage'} />
        </span>
      </span>
    </Button>
  );
}
