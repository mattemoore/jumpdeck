import Layout from '~/core/ui/Layout';
import Logo from '~/core/ui/Logo';
import Heading from '~/core/ui/Heading';

const AuthPageLayout: React.FCC<{
  heading: string | React.ReactNode;
}> = ({ children, heading }) => {
  return (
    <Layout>
      <div
        className={
          'flex h-screen flex-col items-center justify-center space-y-8' +
          ' bg-gray-50 dark:bg-black-600'
        }
      >
        <div>
          <Logo />
        </div>

        <div
          className={`flex w-11/12 flex-col items-center space-y-5 rounded-xl border border-transparent bg-white p-8 dark:bg-black-400 dark:bg-black-500 sm:border-gray-100 dark:sm:border-black-300 md:w-8/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12`}
        >
          <div>
            <Heading type={3}>{heading}</Heading>
          </div>

          {children}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPageLayout;
