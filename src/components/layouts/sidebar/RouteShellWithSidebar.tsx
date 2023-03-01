import { useEffect } from 'react';

import { isBrowser } from '~/core/generic/is-browser';
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
          <div className={'w-full'}>
            <Heading type={5}>
              <span className={'font-medium dark:text-white'}>{title}</span>
            </Heading>
          </div>
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
