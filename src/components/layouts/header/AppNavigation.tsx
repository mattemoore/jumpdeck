import NavigationItem from '~/core/ui/Navigation/NavigationItem';

const links = {
  Dashboard: {
    path: '/dashboard',
    i18n: 'common:dashboardTabLabel',
  },
  Organization: {
    path: '/settings/organization',
    i18n: 'common:organizationSettingsTabLabel',
  },
  Profile: {
    path: '/settings/profile',
    i18n: 'common:profileSettingsTabLabel',
  },
  Subscription: {
    path: '/settings/subscription',
    i18n: 'common:subscriptionSettingsTabLabel',
  },
};

const AppNavigation: React.FC = () => {
  return (
    <>
      <ul className={'flex space-x-6'}>
        <NavigationItem link={links.Dashboard} />
        <NavigationItem link={links.Organization} />
        <NavigationItem link={links.Profile} />
        <NavigationItem link={links.Subscription} />
      </ul>
    </>
  );
};

export default AppNavigation;
