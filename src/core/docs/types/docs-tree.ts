import Directory from '~/core/docs/types/directory';
import Page from '~/core/docs/types/page';

export type DocsTree = {
  directory: Directory;
  pages: Page[];
};
