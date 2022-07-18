import React from 'react';
import RouteShell from '~/components/RouteShell';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationContainer from '~/core/ui/Navigation/NavigationContainer';

const links = {
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

const SettingsPageContainer: React.FCC<{
  title: string;
}> = ({ children, title }) => {
  return (
    <RouteShell title={title}>
      <div className={'flex flex-col space-y-4'}>
        <NavigationContainer
          className={'border-t-transparent dark:border-t-transparent'}
        >
          <NavigationMenu bordered>
            <NavigationItem link={links.Profile} />
            <NavigationItem link={links.Organization} />
            <NavigationItem link={links.Subscription} />
          </NavigationMenu>
        </NavigationContainer>
      </div>

      <div className={'mt-8'}>{children}</div>
    </RouteShell>
  );
};

export default SettingsPageContainer;
