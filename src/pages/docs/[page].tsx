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
import SearchInput from '~/components/SearchInput';
import SubHeading from '~/core/ui/SubHeading';

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

      <Layout>
        <SiteHeader />

        <Container>
          <div className={'block md:hidden'}>
            <FloatingDocumentationNavigation data={docs} />
          </div>

          <div className={'md:flex md:space-x-8 lg:space-x-16'}>
            <div className={'DocumentationSidebarContainer flex-col space-y-2'}>
              <SearchInput path={'/docs/results'} />

              <DocumentationNavigation data={docs} />
            </div>

            <div className="mt-8 flex flex-1 flex-col space-y-2">
              <div>
                <Heading type={1}>
                  <span className={'dark:text-white'}>{page.label}</span>
                </Heading>
              </div>

              <div>
                <SubHeading>
                  <span>{page.description}</span>
                </SubHeading>
              </div>

              <PostBody content={page.content} />

              <div
                className={
                  'flex flex-col justify-between space-y-4 py-12 md:flex-row md:space-y-0'
                }
              >
                <div className={'flex items-center space-x-1'}>
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

                <div className={'flex items-center justify-end space-x-1'}>
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
          'p-2 text-sm font-medium text-current hover:underline dark:text-primary-600'
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
