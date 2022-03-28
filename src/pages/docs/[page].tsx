import { PropsWithChildren } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import ChevronLeftIcon from '@heroicons/react/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/outline/ChevronRightIcon';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import { getDocs, getDocsPageBySlug, getDocsSlugs } from '~/core/docs/api';

import PostBody from '~/components/blog/PostBody';
import SiteHeader from '~/components/SiteHeader';
import DocumentationNavigation from '~/components/docs/DocumentationNavigation';
import FloatingDocumentationNavigation from '~/components/docs/FloatingDocumentationNavigation';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import Footer from '~/components/Footer';
import If from '~/core/ui/If';

import Directory from '~/core/docs/types/directory';
import DocumentationPage from '../../core/docs/types/documentation-page';

type Props = {
  page: {
    title: string;
    content: string;
    description: string;
    label: string;
  };

  nextPage: Maybe<DocumentationPage>;
  previousPage: Maybe<DocumentationPage>;

  docs: Array<{
    directory: Directory;
    pages: DocumentationPage[];
  }>;
};

const DocsPage = ({ page, docs, previousPage, nextPage }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">{page.title}</title>

          <meta property="og:title" content={page.title} key="og:title" />

          <meta
            key="twitter:description"
            property="twitter:description"
            content={page.description}
          />

          <meta
            property="og:description"
            content={page.description}
            key="og:description"
          />

          <meta
            name="description"
            content={page.description}
            key="meta:description"
          />

          <meta
            key="twitter:title"
            property="twitter:title"
            content={page.title}
          />
        </Head>

        <SiteHeader />

        <Container>
          <div className={'block md:hidden'}>
            <FloatingDocumentationNavigation data={docs} />
          </div>

          <div className={'block md:flex md:space-x-8 lg:space-x-16'}>
            <div className={'DocumentationSidebarContainer'}>
              <DocumentationNavigation data={docs} />
            </div>

            <div className="flex-col flex flex-1 mt-8">
              <div>
                <Heading type={1}>
                  <span className={'dark:text-white'}>{page.title}</span>
                </Heading>
              </div>

              <PostBody content={page.content} />

              <div
                className={
                  'flex-col space-y-4 md:space-y-0 md:flex-row flex justify-between py-12'
                }
              >
                <div className={'flex space-x-1 items-center'}>
                  <If condition={previousPage}>
                    {(page) => {
                      return (
                        <>
                          <ChevronLeftIcon className={'h-6'} />

                          <PageLink page={page} />
                        </>
                      );
                    }}
                  </If>
                </div>

                <div className={'flex space-x-1 items-center justify-end'}>
                  <If condition={nextPage}>
                    {(page) => {
                      return (
                        <>
                          <PageLink page={page} />
                          <ChevronRightIcon className={'h-6'} />
                        </>
                      );
                    }}
                  </If>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Layout>

      <Footer />
    </>
  );
};

function PageLink({ page }: PropsWithChildren<{ page: DocumentationPage }>) {
  const hrefAs = `/docs/${page.slug}`;
  const href = '/docs/[page]';

  return (
    <Link as={hrefAs} href={href} passHref>
      <a
        className={
          'font-medium p-2 text-sm text-current hover:underline dark:text-primary-600'
        }
      >
        {page.title}
      </a>
    </Link>
  );
}

export default DocsPage;

type Params = {
  params: {
    page: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const currentPage = await getDocsPageBySlug(params.page);
  const currentPagePosition = currentPage?.position ?? 0;

  const docs = getDocs();

  const directory =
    docs.find((item) =>
      item?.pages.some((page) => page.slug === params.page)
    ) ?? null;

  const getPageByIndex = (index: number) => {
    return (
      directory?.pages.find((page) => {
        return page.position === index;
      }) ?? null
    );
  };

  const nextPage = getPageByIndex(currentPagePosition + 1);
  const previousPage = getPageByIndex(currentPagePosition - 1);

  const { props } = await withTranslationProps();

  return {
    props: {
      ...props,
      page: currentPage,
      nextPage,
      previousPage,
      docs,
    },
  };
};

export function getStaticPaths() {
  const docs = getDocsSlugs();

  const paths = docs.map((item) => {
    return {
      params: {
        page: item,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
