import { useCallback, useMemo } from 'react';
import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';

import configuration from '~/configuration';
import { useUserSession } from '~/core/hooks/use-user-session';

import Heading from '~/core/ui/Heading';
import Logo from '~/core/ui/Logo';
import Container from '~/core/ui/Container';

import ProfileDropdown from '../../ProfileDropdown';
import AppNavigation from './AppNavigation';

const OrganizationsSelector = dynamic(
  () => import('../../organizations/OrganizationsSelector'),
  {
    ssr: false,
  }
);

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
      <div className="AppHeader">
        <div className={'w-full px-6'}>
          <div className={'flex w-full flex-1 items-center justify-between'}>
            <div className={'flex flex-1 items-center space-x-4 md:space-x-6'}>
              <Logo href={configuration.paths.appHome} />

              <div>{OrganizationsDropdown}</div>
            </div>

            <div className={'flex flex-1 justify-end'}>
              <ProfileDropdown
                user={userSession?.auth}
                signOutRequested={signOutRequested}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className={'px-4'}>
          <AppNavigation />
        </div>

        <div className={'border-y border-gray-100 py-6 dark:border-black-300'}>
          <Container>
            <Heading type={2}>
              <span className={'font-medium dark:text-white'}>{children}</span>
            </Heading>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AppHeaderWithMenu;
