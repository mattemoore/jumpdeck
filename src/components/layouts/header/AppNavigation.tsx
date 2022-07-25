import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationContainer from '~/core/ui/Navigation/NavigationContainer';

const links = {
  Dashboard: {
    path: '/dashboard',
    i18n: 'common:dashboardTabLabel',
  },
  Settings: {
    path: '/settings',
    i18n: 'common:settingsTabLabel',
  },
};

const AppNavigation: React.FCC = () => {
  return (
    <NavigationContainer>
      <NavigationMenu bordered>
        <NavigationItem link={links.Dashboard} />
        <NavigationItem link={links.Settings} />
      </NavigationMenu>
    </NavigationContainer>
  );
};

export default AppNavigation;
