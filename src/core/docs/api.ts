import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

import {
  filterMdxFiles,
  getPath,
  readDirectory,
  readFrontMatter,
} from '../generic/fs-utils';

import Directory from './types/directory';
import DocumentationPage from './types/documentation-page';
import { DocsTree } from '~/core/docs/types/docs-tree';
import { compileMdx } from '~/core/generic/compile-mdx';
import getMDXHeadings from '~/core/generic/get-mdx-headings';

const DOCS_DIRECTORY_NAME = `_docs`;
const DIRECTORY_CONFIG_NAME = 'meta.json';

const docsDirectory = join(process.cwd(), DOCS_DIRECTORY_NAME);

export function getDocs() {
  const directories = readDirectory(docsDirectory) ?? [];

  return directories
    .map((directoryName) => {
      const directoryPath = join(DOCS_DIRECTORY_NAME, directoryName);
      const configPath = `${process.cwd()}/${directoryPath}/${DIRECTORY_CONFIG_NAME}`;
      const fileNames = filterMdxFiles(readDirectory(directoryPath));

      const pages = fileNames
        .map((slug) => {
          const { fullPath, realSlug } = getPath(slug, directoryPath);
          const matter = readFrontMatter(fullPath);

          return {
            slug: realSlug,
            content: matter?.content,
            ...(matter?.data ?? {}),
          } as DocumentationPage;
        })
        .sort((prev, next) => {
          return sortByPosition(prev?.position, next?.position);
        });

      if (!existsSync(configPath)) {
        return;
      }

      const config = readFileSync(configPath, 'utf-8');
      const directory = JSON.parse(config) as Maybe<Directory>;

      if (!directory) {
        return;
      }

      return {
        directory,
        pages,
      };
    })
    .filter(Boolean)
    .sort((prev, next) => {
      return sortByPosition(
        prev?.directory?.position ?? 0,
        next?.directory?.position ?? 0
      );
    }) as DocsTree[];
}

function sortByPosition(prev: number, next: number) {
  return next > prev ? -1 : 1;
}

export function getDocsSlugs() {
  const docs = readDirectory(docsDirectory);

  return docs.reduce<string[]>((acc, folder) => {
    const directoryPath = join(DOCS_DIRECTORY_NAME, folder);
    const mdxFiles = filterMdxFiles(readDirectory(directoryPath));

    const directoryData = mdxFiles.filter((item) => {
      const { realSlug } = getPath(item, docsDirectory);

      return realSlug;
    });

    const pages = directoryData
      .map((slug) => {
        const { realSlug } = getPath(slug, directoryPath);

        return realSlug;
      })
      .filter(Boolean);

    return [...acc, ...pages];
  }, []);
}

export async function getDocsPageBySlug(slug: string) {
  for (const directory of getDocs()) {
    const pages = directory?.pages ?? [];

    for (const page of pages) {
      if (page.slug !== slug) {
        continue;
      }

      const rawMdx = page?.content ?? '';
      const compiled = await compileMdx(rawMdx);
      const headings = getMDXHeadings(rawMdx);
      const content = compiled ?? null;

      return {
        ...page,
        content,
        headings,
      };
    }
  }
}
