import AppSidebar from './AppSidebar';
import AppHeaderNoMenu from './AppHeaderNoMenu';

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <AppSidebar />

      <div className={'relative mx-auto w-full overflow-y-auto py-2'}>
        <AppHeaderNoMenu>{title}</AppHeaderNoMenu>

        <div className={'relative p-4'}>{children}</div>
      </div>
    </div>
  );
};

export default RouteShellWithSidebar;
