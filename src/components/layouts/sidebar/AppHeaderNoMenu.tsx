import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';

import { useUserSession } from '~/core/hooks/use-user-session';
import ProfileDropdown from '~/components/ProfileDropdown';
import If from '~/core/ui/If';

import OrganizationsSelector from '~/components/organizations/OrganizationsSelector';
import HeaderSubscriptionStatusBadge from '~/components/subscriptions/HeaderSubscriptionStatusBadge';

const MobileNavigation = dynamic(() => import('~/components/MobileNavigation'));

const AppHeaderNoMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  return (
    <div className="flex flex-1 items-center justify-between border-b border-gray-50 py-2.5 px-3 dark:border-black-300">
      <div className={'flex items-center space-x-2.5 lg:space-x-0'}>
        <div className={'flex items-center lg:hidden'}>
          <MobileNavigation />
        </div>

        <div className={'flex items-center space-x-2.5 lg:space-x-4'}>
          <If condition={userSession?.auth?.uid}>
            {(uid) => <OrganizationsSelector userId={uid} />}
          </If>

          {children}
        </div>
      </div>

      <div className={'flex items-center justify-center space-x-4'}>
        <div className={'hidden items-center lg:flex'}>
          <HeaderSubscriptionStatusBadge />
        </div>

        <ProfileDropdown
          user={userSession?.auth}
          signOutRequested={() => auth.signOut()}
        />
      </div>
    </div>
  );
};

export default AppHeaderNoMenu;
