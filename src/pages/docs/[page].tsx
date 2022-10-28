import { PropsWithChildren } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import { getDocs, getDocsPageBySlug, getDocsSlugs } from '~/core/docs/api';

import PostBody from '~/components/blog/PostBody';
import SiteHeader from '~/components/SiteHeader';
import DocumentationNavigation from '~/components/docs/DocumentationNavigation';
import FloatingDocumentationNavigation from '~/components/docs/FloatingDocumentationNavigation';

import Layout from '~/core/ui/Layout';
import Heading from '~/core/ui/Heading';
import Footer from '~/components/Footer';
import If from '~/core/ui/If';

import Directory from '~/core/docs/types/directory';
import SubHeading from '~/core/ui/SubHeading';

import DocumentationPage from '../../core/docs/types/documentation-page';
import PostHeadings from '~/components/blog/PostHeadings/PostHeadings';

type Page = {
  title: string;
  content: string;
  headings: Array<{ level: number; text: string }>;
  description: string;
  label: string;
};

type Props = {
  page: Page;

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
        <PageHead page={page} />

        <SiteHeader />

        <div>
          <div className={'block lg:hidden'}>
            <FloatingDocumentationNavigation data={docs} />
          </div>

          <div className={'flex justify-between md:space-x-2 lg:space-x-4'}>
            <div
              className={
                'DocumentationSidebarContainer w-3/12 max-w-xs' +
                ' hidden border-r border-gray-100 dark:border-black-400 lg:flex'
              }
            >
              <div className={'w-full flex-col space-y-2 px-6 py-8'}>
                <DocumentationNavigation data={docs} />
              </div>
            </div>

            <div className="mx-auto flex w-full flex-1 flex-col space-y-2 py-8 px-4 lg:max-w-4xl lg:px-0">
              <Heading type={1}>
                <span className={'dark:text-white'}>{page.label}</span>
              </Heading>

              <SubHeading>
                <span>{page.description}</span>
              </SubHeading>

              <PostBody content={page.content} />

              <div className={'my-8'}>
                <DocumentationLinks
                  previousPage={previousPage}
                  nextPage={nextPage}
                />
              </div>
            </div>

            <div
              className={
                'DocumentationSidebarContainer hidden w-3/12 max-w-xs lg:flex' +
                ' border-l border-gray-100 px-6 py-8 dark:border-black-400'
              }
            >
              <PostHeadings headings={page.headings} />
            </div>
          </div>
        </div>
      </Layout>

      <Footer />
    </>
  );
};

function PageLink({ page }: PropsWithChildren<{ page: DocumentationPage }>) {
  const hrefAs = `/docs/${page.slug}`;
  const href = '/docs/[page]';

  return (
    <Link
      as={hrefAs}
      href={href}
      className={
        'p-2 text-sm font-medium text-current hover:underline dark:text-primary-600'
      }
    >
      {page.title}
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

  if (!currentPage) {
    return {
      notFound: true,
    };
  }

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

function DocumentationLinks({
  previousPage,
  nextPage,
}: React.PropsWithChildren<{
  previousPage: Maybe<DocumentationPage>;
  nextPage: Maybe<DocumentationPage>;
}>) {
  return (
    <div
      className={
        'flex flex-col justify-between space-y-4 md:flex-row md:space-y-0'
      }
    >
      <div className={'flex items-center space-x-1'}>
        <If condition={previousPage}>
          {(page) => {
            return (
              <>
                <ChevronLeftIcon className={'h-4'} />
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
                <ChevronRightIcon className={'h-4'} />
              </>
            );
          }}
        </If>
      </div>
    </div>
  );
}

function PageHead({
  page,
}: React.PropsWithChildren<{
  page: Page;
}>) {
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
    </>
  );
}
