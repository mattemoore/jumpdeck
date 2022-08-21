import MiniSearch from 'minisearch';
import SearchEngine from '~/core/search-engine';

const FIELDS = ['content', 'path', 'tag', 'title', 'collection', 'slug'];

export async function searchIndexer() {
  const miniSearch = new MiniSearch({
    fields: FIELDS,
    storeFields: FIELDS,
  });

  const engine = new SearchEngine(miniSearch);

  console.log(`[Search Engine] Indexing Blog posts...`);

  await engine.indexDirectory(`_posts`, (doc) => {
    return { ...doc, tag: `blog` };
  });

  console.log(`[Search Engine] Indexing Documentation...`);

  await engine.indexDirectory(`_docs`, (doc) => {
    return { ...doc, tag: `docs` };
  });

  console.log(
    `[Search Engine] Indexed ${engine.getDocumentCount()} document(s)`
  );

  await engine.export();

  process.exit();
}

void searchIndexer();
