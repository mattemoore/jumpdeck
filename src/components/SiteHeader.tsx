import { useAuth } from 'reactfire';
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
    <div className={`w-full py-4 ${fixed ? fixedClassName : ''}`}>
      <Container>
        <div className="flex flex-row items-center justify-between">
          <div className={'flex items-center space-x-4'}>
            <Logo />

            <DarkModeToggle />
          </div>

          <div className={'flex items-center space-x-8'}>
            {
              // ON MOBILE WE DISPLAY THE HAMBURGER MENU AT THE END
            }
            <div className={'order-1 md:order-none md:ml-0'}>
              <SiteNavigation />
            </div>
          </div>

          <If condition={userSession?.auth} fallback={<SignInButton />}>
            {(user) => (
              <ProfileDropdown
                user={user}
                signOutRequested={signOutRequested}
              />
            )}
          </If>
        </div>
      </Container>
    </div>
  );
};

function SignInButton() {
  return (
    <div className={'flex space-x-2'}>
      <Button color={'transparent'} href={configuration.paths.signIn}>
        Sign In
      </Button>

      <Button href={configuration.paths.signUp}>Sign Up</Button>
    </div>
  );
}

export default SiteHeader;
