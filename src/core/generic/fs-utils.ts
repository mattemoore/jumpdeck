import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const MDX = `mdx`;

export function readDirectory(path: string) {
  return readdirSync(path);
}

export function filterMdxFiles(fileNames: string[]) {
  return fileNames.filter((fileName) => fileName.endsWith(`.${MDX}`));
}

export function readFrontMatter(fullPath: string) {
  try {
    const fileContents = readFileSync(fullPath, 'utf8');

    return matter(fileContents);
  } catch {
    return;
  }
}

export function getPath(slug: string, directory: string) {
  const regExp = /\.(mdx|md)$/;
  const result = slug.match(regExp);
  const realSlug = slug.replace(regExp, '');
  const extension = (result && result[0]) ?? `.${MDX}`;
  const pathWithExtension = `${realSlug}${extension}`;
  const fullPath = join(directory, pathWithExtension);

  return {
    fullPath,
    realSlug,
  };
}
