import Link from 'next/link';
import Head from 'next/head';

import { SearchResult } from 'minisearch';

import Layout from '~/core/ui/Layout';
import SiteHeader from '~/components/SiteHeader';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SearchInput from '~/components/SearchInput';
import Footer from '~/components/Footer';

const SearchResultsPage: React.FC<{
  results: SearchResult[];
  query: Maybe<string>;
  pathMapper: (doc: SearchResult) => string;
}> = ({ results, query, pathMapper }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <Layout>
        <SiteHeader />

        <Container>
          <div className="mt-8 flex flex-1 flex-col space-y-8">
            <Heading type={1}>
              <span className={'dark:text-white'}>
                Search Results ({results.length} found)
              </span>
            </Heading>

            <div>
              <SearchInput query={query} path={'/docs/results'} />
            </div>

            <div className={'flex flex-col space-y-8'}>
              {results.map((result) => {
                const href = pathMapper(result);
                const content = `${result.content.substring(0, 300)}...`;

                return (
                  <div className={'flex flex-col space-y-2'} key={result.id}>
                    <Heading type={3}>
                      <Link href={href} passHref>
                        <a>{result.title}</a>
                      </Link>
                    </Heading>

                    <div>
                      <Link href={href} passHref>
                        <a className={'text-xs'}>{content}</a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Layout>

      <Footer />
    </>
  );
};

export default SearchResultsPage;
