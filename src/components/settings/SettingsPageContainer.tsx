import React from 'react';
import RouteShell from '~/components/RouteShell';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';

const links = [
  {
    path: '/settings/profile',
    i18n: 'common:profileSettingsTabLabel',
  },
  {
    path: '/settings/organization',
    i18n: 'common:organizationSettingsTabLabel',
  },
  {
    path: '/settings/subscription',
    i18n: 'common:subscriptionSettingsTabLabel',
  },
];

const SettingsPageContainer: React.FCC<{
  title: string;
}> = ({ children, title }) => {
  return (
    <RouteShell title={title}>
      <NavigationMenu>
        {links.map((link) => (
          <NavigationItem link={link} key={link.path} />
        ))}
      </NavigationMenu>

      <div
        className={`flex flex-col space-y-4 md:mt-8 md:flex-row md:justify-between md:space-x-2 md:space-y-0`}
      >
        {children}
      </div>
    </RouteShell>
  );
};

export default SettingsPageContainer;
