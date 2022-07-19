import MiniSearch from 'minisearch';
import SearchEngine from '~/core/search-engine';

const FIELDS = ['content', 'path', 'tag', 'title', 'collection', 'slug'];

export async function searchIndexer() {
  const miniSearch = new MiniSearch({
    fields: FIELDS,
    storeFields: FIELDS,
  });

  const engine = new SearchEngine(miniSearch);

  await engine.indexDirectory(`_posts`, (doc) => {
    return { ...doc, tag: `blog` };
  });

  await engine.indexDirectory(`_docs`, (doc) => {
    return { ...doc, tag: `docs` };
  });

  await engine.export();

  process.exit();
}

void searchIndexer();
