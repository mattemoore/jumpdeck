import Head from 'next/head';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import SiteHeader from '~/components/SiteHeader';

const Contact = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">Contact - {configuration.site.name}</title>
        </Head>

        <SiteHeader />

        <Container>
          <Hero>Contact</Hero>
        </Container>

        <Footer />
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

export default Contact;
