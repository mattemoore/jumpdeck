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
          'flex h-screen flex-col items-center justify-center space-y-4' +
          ' md:space-y-8 lg:bg-gray-50 dark:lg:bg-black-700'
        }
      >
        <div>
          <Logo />
        </div>

        <div
          className={`flex w-full max-w-md flex-col items-center space-y-5 rounded-2xl border-transparent bg-white px-5 py-1 dark:bg-black-600 dark:bg-black-500 md:w-8/12 md:border md:px-8 md:py-6 md:shadow-sm dark:md:border-black-400 lg:w-5/12 xl:w-4/12 2xl:w-3/12`}
        >
          <div>
            <Heading type={5}>
              <span className={'font-medium'}>
                {heading}
              </span>
            </Heading>
          </div>

          {children}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPageLayout;
