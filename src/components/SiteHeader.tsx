import { useAuth } from 'reactfire';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import { useUserSession } from '~/core/hooks/use-user-session';

import Logo from '~/core/ui/Logo';
import Container from '~/core/ui/Container';
import If from '~/core/ui/If';

import SiteNavigation from './SiteNavigation';
import ProfileDropdown from './ProfileDropdown';
import Button from '~/core/ui/Button';
import DarkModeToggle from '~/components/DarkModeToggle';

import configuration from '~/configuration';

const fixedClassName = `FixedHeader`;

const SiteHeader: React.FCC<{
  fixed?: boolean;
}> = ({ fixed }) => {
  const auth = useAuth();
  const userSession = useUserSession();

  const signOutRequested = () => auth.signOut();

  return (
    <div
      className={`w-full py-2.5 px-1 lg:px-6 ${fixed ? fixedClassName : ''}`}
    >
      <Container>
        <div className="flex flex-row items-center">
          <div className={'flex items-center space-x-4'}>
            <Logo />

            <DarkModeToggle />
          </div>

          <div className={'flex flex-1 justify-end space-x-4'}>
            <div
              className={
                'order-1 flex items-center space-x-4 lg:space-x-8' +
                ' md:order-none md:ml-0'
              }
            >
              <SiteNavigation />
            </div>

            <If condition={userSession?.auth} fallback={<AuthButtons />}>
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

function AuthButtons() {
  return (
    <div className={'flex space-x-2'}>
      <Button color={'transparent'} href={configuration.paths.signIn}>
        <span>Sign In</span>
      </Button>

      <Button href={configuration.paths.signUp}>
        <span className={'flex items-center space-x-2'}>
          <span>Sign Up</span>
          <ArrowRightIcon className={'h-4'} />
        </span>
      </Button>
    </div>
  );
}

export default SiteHeader;
