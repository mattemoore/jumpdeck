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
  const itemClassName = `flex justify-center md:justify-start items-center flex-auto sm:flex-initial`;

  return (
    <div
      className={
        'flex flex-row justify-between space-x-2 md:justify-start' +
        ' sm:flex-col sm:space-x-0 sm:space-y-2'
      }
    >
      <NavigationItem
        className={itemClassName}
        link={links.General}
        depth={0}
      />

      <NavigationItem className={itemClassName} link={links.Members} />
    </div>
  );
};

export default OrganizationSettingsTabs;
