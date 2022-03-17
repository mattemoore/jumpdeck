import Collection from './collection';

export default interface BasePost {
  slug: string;
  title: string;
  date: string;
  live: boolean;
  collection: Collection;
  readingTime: string;
  content: string;
}
