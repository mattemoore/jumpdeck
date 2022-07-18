import configuration from '~/configuration';
import { withTranslationProps } from '~/lib/props/with-translation-props';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';

import ConvertkitSignupForm from '~/components/ConvertkitSignupForm';
import SiteHeader from '~/components/SiteHeader';
import SubHeading from '~/core/ui/SubHeading';

const Index = () => {
  return (
    <>
      <Layout>
        <SiteHeader />

        <Container>
          <div
            className={
              'my-8 flex flex-col items-center md:my-28 md:flex-row' +
              ' mx-auto flex-1 justify-center'
            }
          >
            <div
              className={'flex w-full flex-1 flex-col items-center space-y-12'}
            >
              <h1
                className={
                  'text-center text-5xl text-black-500 dark:text-current' +
                  ' sm:text-6xl md:text-7xl lg:text-[5.75rem]' +
                  ' font-extrabold'
                }
              >
                <span className={'block'}>
                  <span className={'text-current dark:text-white'}>
                    Tell us why your SaaS is awesome
                  </span>
                </span>
              </h1>

              <div className={'text-center text-gray-700 dark:text-gray-400'}>
                <SubHeading>A short description of your SaaS</SubHeading>
              </div>

              <div className={'flex flex-col space-y-2'}>
                <ConvertkitSignupForm
                  formId={configuration.site.convertKitFormId}
                >
                  Subscribe
                </ConvertkitSignupForm>

                <span
                  className={
                    'text-center text-xs text-gray-600 dark:text-gray-400'
                  }
                >
                  Subscribe to our newsletter to receive updates
                </span>
              </div>
            </div>
          </div>
        </Container>

        <Footer />
      </Layout>
    </>
  );
};

export default Index;

export async function getStaticProps() {
  const { props } = await withTranslationProps();

  return {
    props,
  };
}
