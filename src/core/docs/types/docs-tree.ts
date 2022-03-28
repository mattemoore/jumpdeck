import Directory from '~/core/docs/types/directory';
import DocumentationPage from './documentation-page';

export type DocsTree = {
  directory: Directory;
  pages: DocumentationPage[];
};
