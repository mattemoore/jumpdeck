import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';

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
  const itemClassName = `flex justify-center md:justify-start items-center flex-auto md:flex-initial`;

  return (
    <div>
      <NavigationMenu secondary vertical>
        <NavigationItem
          className={itemClassName}
          link={links.General}
          depth={0}
        />

        <NavigationItem className={itemClassName} link={links.Members} />
      </NavigationMenu>
    </div>
  );
};

export default OrganizationSettingsTabs;
