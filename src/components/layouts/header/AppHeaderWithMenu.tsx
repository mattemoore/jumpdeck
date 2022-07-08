import { useCallback, useMemo } from 'react';
import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';

import configuration from '~/configuration';
import { useUserSession } from '~/lib/hooks/use-user-session';

import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import Heading from '~/core/ui/Heading';
import Logo from '~/core/ui/Logo';

import Container from '~/core/ui/Container';

import ProfileDropdown from '../../ProfileDropdown';
import AppNavigation from './AppNavigation';

const OrganizationsSelector = dynamic(
  () => import('../../OrganizationsSelector'),
  {
    ssr: false,
  }
);

const links = {
  Docs: {
    label: 'Docs',
    path: '/docs',
  },
};

const AppHeaderWithMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  const OrganizationsDropdown = useMemo(() => {
    const user = userSession?.auth;
    const userId = user?.uid;

    if (!userId) {
      return null;
    }

    return <OrganizationsSelector userId={userId} />;
  }, [userSession?.auth]);

  const signOutRequested = useCallback(() => {
    void auth.signOut();
  }, [auth]);

  return (
    <>
      <Container>
        <div className="AppHeader">
          <div className={'flex flex-1 flex-col space-y-8'}>
            <div className={'flex items-center justify-between'}>
              <div
                className={'flex flex-1 items-center space-x-4 md:space-x-8'}
              >
                <Logo href={configuration.paths.appHome} />

                <div>{OrganizationsDropdown}</div>
              </div>

              <div className={'flex flex-1 justify-end'}>
                <div className={'flex items-center space-x-4'}>
                  <div className={'hidden md:flex'}>
                    <NavigationMenu>
                      <NavigationItem link={links.Docs} />
                    </NavigationMenu>
                  </div>

                  <ProfileDropdown
                    user={userSession?.auth}
                    signOutRequested={signOutRequested}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div>
        <div
          className={
            'border border-gray-100 py-2 dark:border-black-400' +
            ' hidden md:block'
          }
        >
          <Container>
            <AppNavigation />
          </Container>
        </div>

        <div className={'border-b border-gray-100 py-2 dark:border-black-400'}>
          <Container>
            <Heading type={2}>{children}</Heading>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AppHeaderWithMenu;
