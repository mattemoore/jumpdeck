import { useAuth } from 'reactfire';

import { useUserSession } from '~/core/hooks/use-user-session';

import Heading from '~/core/ui/Heading';
import ProfileDropdown from '~/components/ProfileDropdown';
import Container from '~/core/ui/Container';
import { useCallback } from 'react';

const AppHeaderNoMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  return (
    <div className="AppHeader py-2.5 px-4">
      <Heading type={2}>{children}</Heading>

      <div className={'items-center justify-end'}>
        <ProfileDropdown
          user={userSession?.auth}
          signOutRequested={() => auth.signOut()}
        />
      </div>
    </div>
  );
};

export default AppHeaderNoMenu;
