import Layout from '~/core/ui/Layout';
import Logo from '~/core/ui/Logo';
import Heading from '~/core/ui/Heading';

const AuthPageLayout: React.FCC<{
  heading: string | React.ReactNode;
}> = ({ children, heading }) => {
  return (
    <Layout>
      <div className={'flex h-screen flex-col items-center justify-center'}>
        <div
          className={`flex w-11/12 flex-col items-center space-y-7 md:w-8/12 lg:w-5/12 xl:w-4/12 2xl:w-96`}
        >
          <div>
            <Logo />
          </div>

          <div>
            <Heading type={2}>{heading}</Heading>
          </div>

          {children}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPageLayout;
