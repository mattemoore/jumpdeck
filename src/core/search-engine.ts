import MiniSearch, { SearchResult } from 'minisearch';
import { writeFile, readdir, lstat } from 'fs/promises';
import { join } from 'path';
import { readFrontMatter } from '~/core/generic/fs-utils';
import configuration from '~/configuration';

const MDX_EXTENSION = `.mdx`;

/**
 * Usage:
 *
 * const miniSearch = new MiniSearch({
 *   fields: ['title', 'text'],
 *   storeFields: ['title', 'category']
 * });
 *
 * const engine = new SearchEngine(miniSearch);
 */
class SearchEngine {
  constructor(private readonly engine: MiniSearch) {}

  static from(json: string) {
    return MiniSearch.loadJSON(json, {
      fields: ['title', 'content', 'path', 'tag', 'collection', 'slug'],
    });
  }

  async export() {
    const json = JSON.stringify(this.engine);
    const path = join(process.cwd(), configuration.paths.searchIndex);

    return writeFile(path, json);
  }

  async indexDirectory(directory: string, mapper: <T>(document: T) => T) {
    const files = await readdir(directory);

    for (const file of files) {
      const fullPath = join(directory, file);
      const stats = await lstat(fullPath);

      if (stats.isDirectory()) {
        await this.indexDirectory(fullPath, mapper);
      } else {
        if (stats.isFile() && file.endsWith(MDX_EXTENSION)) {
          const matter = readFrontMatter(fullPath);

          if (!matter) {
            continue;
          }

          const content = matter.content;
          const data = matter.data;

          this.engine.add(
            mapper({
              id: fullPath,
              content,
              title: data?.title,
              path: file,
              collection: data.collection,
            })
          );
        }
      }
    }
  }

  search(query: string, filter?: (document: SearchResult) => boolean) {
    return this.engine.search(query, {
      filter,
    });
  }

  getDocumentCount() {
    return this.engine.documentCount;
  }
}

export default SearchEngine;
