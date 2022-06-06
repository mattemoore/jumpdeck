import AppSidebar from './AppSidebar';
import AppHeaderNoMenu from './AppHeaderNoMenu';
import Container from '~/core/ui/Container';

const RouteShellWithSidebar: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <AppSidebar />

      <div
        className={
          'relative mx-auto w-full overflow-y-auto sm:w-10/12 xl:w-8/12'
        }
      >
        <AppHeaderNoMenu>{title}</AppHeaderNoMenu>

        <div className={'relative w-full py-2 lg:absolute'}>
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
};

export default RouteShellWithSidebar;
