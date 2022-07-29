import { useAuth } from 'reactfire';
import Link from 'next/link';

import { useUserSession } from '~/core/hooks/use-user-session';
import configuration from '~/configuration';

import Logo from '~/core/ui/Logo';
import Container from '~/core/ui/Container';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

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
              // ON MOBILE WE DISPLAY THE HAMBURGER MENU AT THE END 0
            }
            <div className={'order-1 md:order-none md:ml-0'}>
              <SiteNavigation />
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
        </div>
      </Container>
    </div>
  );
};

function SignInButton() {
  const isEmulator = configuration.emulator;

  return isEmulator ? (
    <Button className={'rounded-full'}>
      <Link href={'/auth/sign-in'}>Get Started</Link>
    </Button>
  ) : null;
}

export default SiteHeader;
