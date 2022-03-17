import { useAuth } from 'reactfire';

import { useUserSession } from '~/lib/hooks/use-user-session';

import Heading from '~/core/ui/Heading';
import ProfileDropdown from '~/components/ProfileDropdown';
import Container from '~/core/ui/Container';

const AppHeaderNoMenu: React.FC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  const signOutRequested = () => auth.signOut();

  return (
    <Container>
      <div className="AppHeader py-4">
        <Heading type={2}>{children}</Heading>

        <div className={'justify-end items-center'}>
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
