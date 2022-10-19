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
        className={`flex flex-col space-y-4 md:space-y-0 lg:mt-8 lg:flex-row lg:space-x-16 xl:space-x-24`}
      >
        {children}
      </div>
    </RouteShell>
  );
};

export default SettingsPageContainer;
