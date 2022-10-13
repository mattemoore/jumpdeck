import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';
import ChevronRightIcon from '@heroicons/react/20/solid/ChevronRightIcon';

import { useUserSession } from '~/core/hooks/use-user-session';
import ProfileDropdown from '~/components/ProfileDropdown';
import If from '~/core/ui/If';

const OrganizationsSelector = dynamic(
  () => import('../../organizations/OrganizationsSelector'),
  {
    ssr: false,
  }
);

const AppHeaderNoMenu: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  return (
    <div className="AppHeader justify-between py-2 px-4">
      <div className={'flex items-center'}>
        <div className={'flex items-center space-x-2'}>
          <If condition={userSession?.auth?.uid}>
            {(uid) => <OrganizationsSelector userId={uid} />}
          </If>

          <ChevronRightIcon className={'h-6'} />

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
