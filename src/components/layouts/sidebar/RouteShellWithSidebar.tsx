import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { isBrowser } from '~/core/generic';
import { SidebarContext } from '~/lib/contexts/sidebar';

import AppHeaderNoMenu from './AppHeaderNoMenu';
import Heading from '~/core/ui/Heading';
import useCollapsible from '~/core/hooks/use-sidebar-state';

const AppSidebar = dynamic(() => import('./AppSidebar'));

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useCollapsible();

  useDisableBodyScrolling();

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
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
      </SidebarContext.Provider>
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
