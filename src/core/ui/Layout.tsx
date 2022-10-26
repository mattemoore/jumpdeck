import Meta from '~/core/ui/Meta';
import Head from "next/head";

const Layout: React.FCC = ({ children }) => {
  return (
    <>
      <Head>
        <Meta />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
