import { useEffect } from 'react';

import { isBrowser } from '~/core/generic';
import AppHeaderNoMenu from './AppHeaderNoMenu';
import Heading from '~/core/ui/Heading';
import AppSidebar from './AppSidebar';

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  useDisableBodyScrolling();

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <div className={'hidden lg:block'}>
        <AppSidebar />
      </div>

      <div className={'relative mx-auto h-screen w-full overflow-y-auto'}>
        <AppHeaderNoMenu>
          <Heading type={4}>
            <span className={'font-semibold dark:text-white'}>{title}</span>
          </Heading>
        </AppHeaderNoMenu>

        <div className={'p-3'}>{children}</div>
      </div>
    </div>
  );
};

export default RouteShellWithSidebar;

function useDisableBodyScrolling() {
  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    document.body.style.setProperty('overflow', 'hidden');

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);
}
