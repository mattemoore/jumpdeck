import Head from 'next/head';
import { Trans } from 'next-i18next';

import configuration from '~/configuration';
import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';

import SiteHeader from '~/components/SiteHeader';
import { withTranslationProps } from '~/lib/props/with-translation-props';

const NotFoundPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">{`Page not found - ${configuration.site.name}`}</title>
        </Head>

        <SiteHeader />

        <Container>
          <div>
            <Hero>
              <Trans i18nKey={'common:pageNotFound'} />
            </Hero>

            <SubHeading>
              <Trans i18nKey={'common:pageNotFoundSubHeading'} />
            </SubHeading>
          </div>

          <div className={'my-8'}>
            <Button href={'/'}>
              <Trans i18nKey={'common:backToHomePage'} />
            </Button>
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

export default NotFoundPage;
