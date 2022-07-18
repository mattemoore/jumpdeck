import Head from 'next/head';
import Link from 'next/link';

import configuration from '~/configuration';
import { withTranslationProps } from '~/lib/props/with-translation-props';

import { getDocs } from '~/core/docs/api';
import Layout from '~/core/ui/Layout';
import SiteHeader from '~/components/SiteHeader';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import Hero from '~/core/ui/Hero';
import Heading from '~/core/ui/Heading';
import GridList from '~/components/blog/GridList';
import SubHeading from '~/core/ui/SubHeading';

import DocumentationNavigation from '~/components/docs/DocumentationNavigation';
import FloatingDocumentationNavigation from '~/components/docs/FloatingDocumentationNavigation';

export default function Docs({
  docs,
}: React.PropsWithChildren<{ docs: ReturnType<typeof getDocs> }>) {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Documentation - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <div className={'block md:hidden'}>
          <FloatingDocumentationNavigation data={docs} />
        </div>

        <Container>
          <div>
            <Hero>Documentation</Hero>

            <SubHeading>
              Explore our guides and examples to start building your app.
            </SubHeading>
          </div>

          <div className={'block md:flex md:space-x-8 lg:space-x-16'}>
            <div className={'DocumentationSidebarContainer'}>
              <DocumentationNavigation data={docs} />
            </div>

            <div className="mt-8 flex flex-1 flex-col">
              <GridList>
                {docs.map((doc) => {
                  const { pages, directory } = doc;
                  const page = pages[0];
                  const href = `/docs/${page?.slug}`;

                  return (
                    <Heading key={href} type={2}>
                      <TopicLink href={href}>
                        <>
                          <span className={'dark:text-white'}>
                            {directory.title}
                          </span>

                          <span
                            className={
                              'block text-base dark:text-gray-300' +
                              ' mt-4 font-medium'
                            }
                          >
                            {directory.description}
                          </span>
                        </>
                      </TopicLink>
                    </Heading>
                  );
                })}
              </GridList>
            </div>
          </div>
        </Container>
      </Layout>

      <Footer />
    </>
  );
}

function TopicLink({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} passHref>
      <a
        className={`flex w-full flex-col rounded-xl bg-gray-50 px-5 py-6 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:border-2 dark:border-black-500 dark:bg-black-400 dark:hover:border-black-300 dark:hover:bg-black-500 dark:active:bg-black-600`}
      >
        {children}
      </a>
    </Link>
  );
}

export async function getStaticProps() {
  const docs = getDocs() ?? [];
  const { props } = await withTranslationProps();

  return {
    props: {
      ...props,
      docs,
    },
  };
}
