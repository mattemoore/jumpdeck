import Link from 'next/link';
import Head from 'next/head';

import { SearchResult } from 'minisearch';

import Layout from '~/core/ui/Layout';
import SiteHeader from '~/components/SiteHeader';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import Footer from '~/components/Footer';

const SearchResultsPage: React.FC<{
  results: SearchResult[];
  query: Maybe<string>;
  pathMapper: (doc: SearchResult) => string;
}> = ({ results, pathMapper }) => {
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

            <div className={'flex flex-col space-y-8'}>
              {results.map((result) => {
                const href = pathMapper(result);
                const content = `${result.content.substring(0, 300)}...`;

                return (
                  <div className={'flex flex-col space-y-2'} key={result.id}>
                    <Heading type={3}>
                      <Link href={href}>{result.title}</Link>
                    </Heading>

                    <div>
                      <Link className={'text-xs'} href={href}>
                        {content}
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
