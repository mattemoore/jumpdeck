import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';

import { useUserSession } from '~/core/hooks/use-user-session';
import ProfileDropdown from '~/components/ProfileDropdown';
import If from '~/core/ui/If';

import OrganizationsSelector from '~/components/organizations/OrganizationsSelector';

const MobileNavigation = dynamic(() => import('~/components/MobileNavigation'));

const AppHeaderNoMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  return (
    <div className="AppHeader justify-between py-2.5 px-3">
      <div className={'flex items-center space-x-2 lg:space-x-0'}>
        <div className={'lg:hidden'}>
          <MobileNavigation />
        </div>

        <div className={'flex items-center space-x-2.5 lg:space-x-4'}>
          <If condition={userSession?.auth?.uid}>
            {(uid) => <OrganizationsSelector userId={uid} />}
          </If>

          {children}
        </div>
      </div>

      <div className={'flex items-center'}>
        <ProfileDropdown
          user={userSession?.auth}
          signOutRequested={() => auth.signOut()}
        />
      </div>
    </div>
  );
};

export default AppHeaderNoMenu;
