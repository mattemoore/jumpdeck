import AppSidebar from './AppSidebar';
import AppHeaderNoMenu from './AppHeaderNoMenu';
import Container from '~/core/ui/Container';

const RouteShellWithSidebar: React.FC<{
  title: string;
}> = ({ title, children }) => {
  return (
    <div className={'flex flex-1 h-full overflow-hidden'}>
      <AppSidebar />

      <div
        className={
          'relative overflow-y-auto w-full xl:w-8/12 sm:w-10/12 mx-auto'
        }
      >
        <AppHeaderNoMenu>{title}</AppHeaderNoMenu>

        <div className={'relative lg:absolute w-full py-2'}>
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
};

export default RouteShellWithSidebar;
