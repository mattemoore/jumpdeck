import { useEffect } from 'react';
import { isBrowser } from '~/core/generic';
import { SidebarContext } from '~/lib/contexts/sidebar';

import AppSidebar from './AppSidebar';
import AppHeaderNoMenu from './AppHeaderNoMenu';
import Heading from '~/core/ui/Heading';
import useCollapsible from '~/core/hooks/use-sidebar-state';

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useCollapsible();

  useDisableBodyScrolling();

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <AppSidebar />

        <div className={'relative mx-auto h-screen w-full overflow-y-auto'}>
          <AppHeaderNoMenu>
            <Heading type={4}>
              <span className={'font-medium dark:text-white'}>{title}</span>
            </Heading>
          </AppHeaderNoMenu>

          <div className={'p-4'}>{children}</div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
};

export default RouteShellWithSidebar;

function useDisableBodyScrolling() {
  useEffect(() => {
    if (isBrowser()) {
      document.body.style.setProperty('overflow', 'hidden');
    }
  }, []);
}
