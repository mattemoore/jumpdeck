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

import OrganizationsSelector from '~/components/organizations/OrganizationsSelector';
import HeaderSubscriptionStatusBadge from '~/components/subscriptions/HeaderSubscriptionStatusBadge';

const MobileNavigation = dynamic(() => import('~/components/MobileNavigation'));

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
    return auth.signOut();
  }, [auth]);

  return (
    <>
      <div className="flex flex-1 items-center justify-between border-b border-gray-50 py-2.5 px-0.5 dark:border-black-300">
        <div className={'w-full px-3 lg:px-6'}>
          <div className={'flex w-full flex-1 items-center justify-between'}>
            <div className={'flex items-center lg:hidden'}>
              <MobileNavigation />
            </div>

            <div className={'flex flex-1 items-center space-x-4'}>
              <div className={'hidden lg:flex'}>
                <Logo href={configuration.paths.appHome} />
              </div>

              <div>{OrganizationsDropdown}</div>
            </div>

            <div className={'flex flex-1 justify-end space-x-4'}>
              <div className={'hidden items-center lg:flex'}>
                <HeaderSubscriptionStatusBadge />
              </div>

              <ProfileDropdown
                user={userSession?.auth}
                signOutRequested={signOutRequested}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className={'px-3'}>
          <AppNavigation />
        </div>

        <div className={'border-b border-gray-100 py-6 dark:border-black-300'}>
          <Container>
            <div className={'px-3 lg:px-1.5'}>
              <Heading type={2}>
                <span className={'font-medium dark:text-white'}>
                  {children}
                </span>
              </Heading>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AppHeaderWithMenu;
