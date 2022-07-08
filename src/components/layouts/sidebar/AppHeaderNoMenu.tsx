import { useAuth } from 'reactfire';

import { useUserSession } from '~/lib/hooks/use-user-session';

import Heading from '~/core/ui/Heading';
import ProfileDropdown from '~/components/ProfileDropdown';
import Container from '~/core/ui/Container';
import { useCallback } from 'react';

const AppHeaderNoMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  const signOutRequested = useCallback(() => {
    void (async () => {
      return auth.signOut();
    })();
  }, [auth]);

  return (
    <Container>
      <div className="AppHeader py-4">
        <Heading type={2}>{children}</Heading>

        <div className={'items-center justify-end'}>
          <ProfileDropdown
            user={userSession?.auth}
            signOutRequested={signOutRequested}
          />
        </div>
      </div>
    </Container>
  );
};

export default AppHeaderNoMenu;
