import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import configuration from '../../configuration';

import { getPath, readDirectory, readFrontMatter } from '../generic/fs-utils';

import Post from './types/post';
import BasePost from './types/base-post';
import Collection from './types/collection';

interface PostMatterData extends Omit<Post, 'collection'> {
  collection: string;
}

type PostFields = Array<keyof Post>;

const DEFAULT_POST_FIELDS: PostFields = [
  'title',
  'date',
  'slug',
  'ogImage',
  'coverImage',
  'collection',
  'excerpt',
  'live',
  'readingTime',
  'tags',
  'content',
];

const POSTS_DIRECTORY_NAME = '_posts';
const COLLECTIONS_DIRECTORY = `_collections`;

const postsDirectory = join(process.cwd(), POSTS_DIRECTORY_NAME);

const collections = readDirectory(COLLECTIONS_DIRECTORY)
  .map((slug) => {
    const path = join(process.cwd(), COLLECTIONS_DIRECTORY, slug);

    if (existsSync(path)) {
      const json = readFileSync(path, 'utf-8');

      try {
        const data = JSON.parse(json) as Collection;
        const realSlug = slug.replace('.json', '');

        return { data, slug, realSlug };
      } catch (e) {
        return;
      }
    }
  })
  .filter(Boolean);

export function getPostsSlugs() {
  return readDirectory(postsDirectory);
}

const allPosts = getPostsSlugs();

export function getPostBySlug(slug: string) {
  return getPostFieldsBySlug(slug, postsDirectory);
}

function getPostFieldsBySlug(
  slug: string,
  directory: string,
  fields = DEFAULT_POST_FIELDS
): Post | undefined {
  const postPathData = getPath(slug, directory);
  const { fullPath, realSlug } = postPathData;
  const file = readFrontMatter(fullPath);

  if (!file) {
    return;
  }

  const content = file.content;
  const data = file.data as PostMatterData;

  const readingTime = getReadingTimeInMinutes(content);

  const post: Partial<Post> = {
    live: data.live,
    readingTime: `${readingTime} min read`,
  };

  for (const field of fields) {
    if (field === 'slug') {
      post[field] = realSlug;
      continue;
    }

    if (field === 'collection') {
      post[field] = getCollectionBySlug(data[field]);
      continue;
    }

    if (field === 'content') {
      post[field] = content;
      continue;
    }

    if (field === 'date') {
      post[field] = new Date(data.date).toISOString();
      continue;
    }

    if (data[field]) {
      Object.assign(post, {
        [field]: data[field],
      });
    }
  }

  return post as Post;
}

export function getPostsByCollection(collectionSlug: string) {
  const collection = getCollectionBySlug(collectionSlug);

  return getAllPosts(
    (item) =>
      item.collection?.name.toLowerCase() === collection.name.toLowerCase()
  );
}

function getReadingTimeInMinutes(content: string, wpm = 225) {
  const words = content.trim().split(/\s+/).length;

  return Math.ceil(words / wpm);
}

function filterByPublishedPostsOnly<Item extends { live: boolean }>(
  post: Item
) {
  // we want to exclude blog posts
  // if it's the prod env AND if not live
  if (!configuration.production || !('live' in post)) {
    return true;
  }

  return post.live;
}

export function getAllPosts(
  filterFn: (post: Partial<Post>) => boolean = () => true
) {
  const posts = allPosts
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean) as Post[];

  return _getAllPosts(posts, filterFn);
}

function _getAllPosts<Type extends BasePost>(
  posts: Type[],
  filterFn: (post: Partial<Type>) => boolean = () => true
) {
  return posts
    .filter(filterByPublishedPostsOnly)
    .filter(filterFn)
    .sort((item, nextItem) => {
      if (!item.date || !nextItem.date) {
        return 1;
      }

      return item.date > nextItem.date ? -1 : 1;
    });
}

export function getAllTags() {
  const tags = getAllPosts().reduce<string[]>((acc, post) => {
    return [...acc, ...(post.tags ?? [])];
  }, []);

  return Array.from(new Set(tags));
}

export function getPostsByTag(tag: string) {
  return getAllPosts((Post) => {
    return Boolean(Post.tags?.includes(tag));
  });
}

export function getCollections() {
  return collections.map((item) => item?.data as Collection);
}

export function getCollectionBySlug(slug: string) {
  const collection = collections.find((item) => {
    return [item?.slug, item?.realSlug].includes(slug);
  });

  if (!collection) {
    throw new Error(
      `Collection with slug "${slug}" was not found. 
      
      Please add a collection file at _collections/${slug}.json`
    );
  }

  return {
    ...collection.data,
    slug: collection.realSlug,
  };
}

export function getCollectionByName(collectionName: string) {
  const collection = collections.find((item) => {
    return item?.data?.name.toLowerCase() === collectionName.toLowerCase();
  });

  return collection?.data as Collection;
}
