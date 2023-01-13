import Head from 'next/head';
import { Trans } from 'next-i18next';

import configuration from '~/configuration';
import Layout from '~/core/ui/Layout';
import Button from '~/core/ui/Button';

import SiteHeader from '~/components/SiteHeader';
import Heading from '~/core/ui/Heading';
import { withTranslationProps } from '~/lib/props/with-translation-props';

const InternalServerErrorPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">{`An error occurred - ${configuration.site.name}`}</title>
        </Head>

        <SiteHeader />

        <div
          className={
            'm-auto flex min-h-[50vh] w-full items-center justify-center'
          }
        >
          <div className={'flex flex-col space-y-8'}>
            <div className={'flex space-x-8 divide-x divide-gray-100'}>
              <div>
                <Heading type={1}>
                  <span className={'text-primary-500'}>500</span>
                </Heading>
              </div>

              <div className={'flex flex-col space-y-4 pl-8'}>
                <div className={'flex flex-col space-y-2'}>
                  <div>
                    <Heading type={1}>
                      <Trans i18nKey={'common:genericError'} />
                    </Heading>
                  </div>

                  <p className={'text-gray-500 dark:text-gray-300'}>
                    <Trans i18nKey={'common:genericErrorSubHeading'} />
                  </p>
                </div>

                <div className={'flex space-x-4'}>
                  <Button color={'secondary'} href={'/'}>
                    <Trans i18nKey={'common:contactUs'} />
                  </Button>

                  <Button href={'/'}>
                    <Trans i18nKey={'common:backToHomePage'} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
