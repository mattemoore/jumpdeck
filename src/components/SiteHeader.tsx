import { useAuth } from 'reactfire';
import Link from 'next/link';

import { useUserSession } from '~/lib/hooks/use-user-session';
import configuration from '~/configuration';

import Logo from '~/core/ui/Logo';
import Container from '~/core/ui/Container';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import SiteNavigation from './SiteNavigation';
import ProfileDropdown from './ProfileDropdown';

const fixedClassName = `FixedHeader`;

const SiteHeader: React.FC<{
  fixed?: boolean;
}> = ({ fixed }) => {
  const auth = useAuth();
  const userSession = useUserSession();

  const signOutRequested = () => auth.signOut();

  return (
    <div
      className={`py-2.5 border-b border-gray-50 dark:border-black-400 w-full ${
        fixed ? fixedClassName : ''
      }`}
    >
      <Container>
        <div className="flex-row flex items-center justify-between">
          <div>
            <Logo />
          </div>

          <div className={'flex justify-end space-x-4 items-center'}>
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
