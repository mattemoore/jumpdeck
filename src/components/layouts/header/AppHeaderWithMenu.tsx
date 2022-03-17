import { useMemo } from 'react';
import { useAuth } from 'reactfire';

import configuration from '~/configuration';
import { useUserSession } from '~/lib/hooks/use-user-session';

import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import Heading from '~/core/ui/Heading';
import Logo from '~/core/ui/Logo';

import Container from '~/core/ui/Container';
import ClientOnly from '~/core/ui/ClientOnly';

import OrganizationsSelector from '../../OrganizationsSelector';
import ProfileDropdown from '../../ProfileDropdown';
import AppNavigation from './AppNavigation';

const links = {
  Docs: {
    label: 'Docs',
    path: '/docs',
  },
};

const AppHeaderWithMenu: React.FC = ({ children }) => {
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

  const signOutRequested = async () => {
    await auth.signOut();
  };

  return (
    <>
      <Container>
        <div className="AppHeader">
          <div className={'flex flex-1 flex-col space-y-8'}>
            <div className={'flex justify-between items-center'}>
              <div
                className={'flex flex-1 items-center space-x-4 md:space-x-8'}
              >
                <Logo href={configuration.paths.appHome} />

                <div suppressHydrationWarning>
                  <ClientOnly>{OrganizationsDropdown}</ClientOnly>
                </div>
              </div>

              <div className={'flex flex-1 justify-end'}>
                <div className={'flex space-x-4 items-center'}>
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
            'border-gray-100 dark:border-black-400 border py-2' +
            ' hidden md:block'
          }
        >
          <Container>
            <AppNavigation />
          </Container>
        </div>

        <div className={'border-gray-100 dark:border-black-400 border-b py-2'}>
          <Container>
            <Heading type={2}>{children}</Heading>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AppHeaderWithMenu;
