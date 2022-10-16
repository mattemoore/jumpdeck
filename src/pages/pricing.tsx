import Head from 'next/head';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import SiteHeader from '~/components/SiteHeader';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';
import Footer from '~/components/Footer';
import PricingTable from '~/components/PricingTable';

const Pricing = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Pricing - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <Container>
          <Hero>Pricing</Hero>
          <SubHeading>Fair pricing for your customers</SubHeading>

          <div className={'mt-12'}>
            <PricingTable />
          </div>
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

export default Pricing;
