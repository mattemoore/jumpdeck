import { withTranslationProps } from '~/lib/props/with-translation-props';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import SiteHeader from '~/components/SiteHeader';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';

const Index = () => {
  return (
    <Layout>
      <SiteHeader />

      <Container>
        <div
          className={
            'my-8 flex flex-col items-center md:my-28 md:flex-row' +
            ' mx-auto flex-1 justify-center'
          }
        >
          <div className={'flex w-full flex-1 flex-col items-center space-y-8'}>
            <h1
              className={
                'text-center text-5xl text-black-500 dark:text-current' +
                ' flex flex-col space-y-2 font-extrabold md:text-6xl' +
                ' xl:text-7xl'
              }
            >
              <span>Tell your visitors why</span>
              <span className={'text-primary-500'}>your SaaS is awesome</span>
            </h1>

            <div className={'text-center text-gray-700 dark:text-gray-400'}>
              <SubHeading>Here goes a short</SubHeading>
              <SubHeading>description of your SaaS</SubHeading>
            </div>

            <Button size={'large'} href={'/auth/sign-up'}>
              Get Started for free
            </Button>
          </div>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

export default Index;

export async function getStaticProps() {
  const { props } = await withTranslationProps();

  return {
    props,
  };
}
