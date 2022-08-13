import Head from 'next/head';

import configuration from '~/configuration';
import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';

import SiteHeader from '~/components/SiteHeader';
import { withTranslationProps } from '~/lib/props/with-translation-props';

const InternalServerErrorPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">{`An error occurred - ${configuration.site.name}`}</title>
        </Head>

        <SiteHeader />

        <Container>
          <div>
            <Hero>Oooops. An error occurred.</Hero>

            <SubHeading>It&apos;s on us, sorry.</SubHeading>
          </div>

          <div className={'my-8'}>
            <Button href={'/'}>Get back to the home page</Button>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  const { props } = await withTranslationProps();

  return {
    props,
  };
}

export default InternalServerErrorPage;
