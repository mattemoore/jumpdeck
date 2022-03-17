import NavigationItem from '~/core/ui/Navigation/NavigationItem';

const links = {
  General: {
    path: '/settings/organization',
    i18n: 'organization:generalTabLabel',
  },
  Members: {
    path: '/settings/organization/members',
    i18n: 'organization:membersTabLabel',
  },
};

const OrganizationSettingsTabs = () => {
  return (
    <div
      className={
        'flex flex-row space-x-2 sm:space-x-0 sm:flex-col sm:space-y-2'
      }
    >
      <NavigationItem
        className={'flex-auto sm:flex-initial'}
        link={links.General}
        depth={0}
      />

      <NavigationItem
        className={'flex-auto sm:flex-initial'}
        link={links.Members}
      />
    </div>
  );
};

export default OrganizationSettingsTabs;
