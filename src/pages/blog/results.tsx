import { GetServerSidePropsContext } from 'next';
import { useCallback } from 'react';

import { join } from 'path';
import { readFile } from 'fs/promises';
import { z } from 'zod';
import type { SearchResult } from 'minisearch';

import SearchEngine from '~/core/search-engine';
import logger from '~/core/logger';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import SearchResultsPage from '~/components/SearchResultsPage';
import configuration from '~/configuration';

const BlogSearchResults: React.FC<{
  results: SearchResult[];
  query: string;
}> = ({ results, query }) => {
  const pathMapper = useCallback((result: SearchResult) => {
    const collection = result.collection.split('.')[0];
    const path = result.path.split('.')[0];

    return `/blog/${collection}/${path}`;
  }, []);

  return (
    <SearchResultsPage
      results={results}
      query={query}
      pathMapper={pathMapper}
    />
  );
};

export default BlogSearchResults;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const schema = getQuerySchema();
  const result = schema.safeParse(ctx.query);

  if (!result.success) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }

  const query = result.data.query;
  const indexFilePath = join(process.cwd(), configuration.paths.searchIndex);

  try {
    const props = await withTranslationProps();
    const index = await readFile(indexFilePath);
    const engine = SearchEngine.from(index.toString('utf-8'));

    const results = engine.search(query, {
      filter: (result) => result.tag === `blog`,
    });

    return {
      props: {
        ...props,
        results,
        query,
      },
    };
  } catch (e) {
    logger.error(
      {
        e,
      },
      `Error while searching for documents...`
    );

    return {
      redirect: {
        destination: '/500',
      },
    };
  }
}

function getQuerySchema() {
  return z.object({
    query: z.string().min(1),
  });
}
