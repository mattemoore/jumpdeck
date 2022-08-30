import { useAuth } from 'reactfire';
import { useUserSession } from '~/core/hooks/use-user-session';

import Logo from '~/core/ui/Logo';
import Container from '~/core/ui/Container';
import If from '~/core/ui/If';

import SiteNavigation from './SiteNavigation';
import ProfileDropdown from './ProfileDropdown';

const fixedClassName = `FixedHeader`;

const SiteHeader: React.FCC<{
  fixed?: boolean;
}> = ({ fixed }) => {
  const auth = useAuth();
  const userSession = useUserSession();

  const signOutRequested = () => auth.signOut();

  return (
    <div
      className={`w-full border-b border-gray-50 py-2 dark:border-black-400 ${
        fixed ? fixedClassName : ''
      }`}
    >
      <Container>
        <div className="flex flex-row items-center justify-between">
          <div>
            <Logo />
          </div>

          <div className={'flex items-center justify-end space-x-4'}>
            {
              // ON MOBILE WE DISPLAY THE HAMBURGER MENU AT THE END
            }
            <div className={'order-1 md:order-none md:ml-0'}>
              <SiteNavigation />
            </div>

            <If condition={userSession?.auth}>
              {(user) => (
                <ProfileDropdown
                  user={user}
                  signOutRequested={signOutRequested}
                />
              )}
            </If>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SiteHeader;
