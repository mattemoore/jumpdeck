import Head from 'next/head';

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
        <Head>
          <title key="title">{configuration.site.name}</title>
        </Head>

        <SiteHeader />

        <Container>
          <div
            className={
              'my-8 md:my-28 flex flex-col items-center md:flex-row' +
              ' justify-center flex-1 mx-auto'
            }
          >
            <div
              className={'flex flex-1 items-center w-full flex-col space-y-12'}
            >
              <h1
                className={
                  'text-black-500 text-center dark:text-current text-5xl' +
                  ' sm:text-6xl md:text-7xl lg:text-[5.75rem]' +
                  ' font-extrabold'
                }
              >
                <span className={'block'}>
                  <span className={'dark:text-white text-current'}>
                    Say why your SaaS
                  </span>

                  <TextGradient>is awesome</TextGradient>
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
                    'text-xs text-center text-gray-600 dark:text-gray-400'
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

function TextGradient({ children }: React.PropsWithChildren<unknown>) {
  return (
    <span
      className={
        'text-transparent block bg-clip-text bg-gradient-to-br' +
        ' from-yellow-400 via-red-400 to-blue-400'
      }
    >
      {children}
    </span>
  );
}
