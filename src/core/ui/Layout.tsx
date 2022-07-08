import Meta from '~/core/ui/Meta';

const Layout: React.FCC = ({ children }) => {
  return (
    <>
      <Meta />
      <main>{children}</main>
    </>
  );
};

export default Layout;
