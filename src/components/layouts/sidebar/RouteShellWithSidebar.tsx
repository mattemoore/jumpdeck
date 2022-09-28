import AppSidebar from './AppSidebar';
import AppHeaderNoMenu from './AppHeaderNoMenu';
import { useEffect } from 'react';
import { isBrowser } from '~/core/generic';

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  useDisableBodyScrolling();

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <AppSidebar />

      <div className={'relative mx-auto h-screen w-full overflow-y-auto'}>
        <AppHeaderNoMenu>{title}</AppHeaderNoMenu>

        <div className={'p-4'}>{children}</div>
      </div>
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
