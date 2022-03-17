/*
- This file gets processed by ts-node as a post-build script
- Please leave the file imports as relative
 */

import { Feed } from 'feed';
import { writeFileSync } from 'fs';

import Article from './types/post';
import { getAllPosts } from './api';
import configuration from '../../configuration';

const DEFAULT_RSS_PATH = 'public/rss.xml';

function generateRSSFeed(articles: Article[], path = DEFAULT_RSS_PATH) {
  const baseUrl = configuration.site.siteUrl ?? '';
  const description = configuration.site.description;
  const title = `${configuration.site.name} - Blog`;

  const author = {
    link: configuration.site.twitterHandle,
  };

  const feed = new Feed({
    title,
    description,
    id: baseUrl,
    link: baseUrl,
    language: configuration.site.language ?? `en`,
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author,
    copyright: '',
  });

  articles.forEach((article) => {
    const {
      date,
      slug,
      title,
      content,
      excerpt: description,
      collection,
      live,
    } = article;

    if (!live) {
      return;
    }

    const url = `${baseUrl}/${collection.slug}/${slug}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description,
      content,
      author: [author],
      date: new Date(date),
    });
  });

  writeFileSync(path, feed.rss2());
}

function main() {
  console.log(`Generating RSS Feed...`);

  try {
    generateRSSFeed(getAllPosts());

    console.log(`RSS Feed generated successfully...`);
    process.exit(0);
  } catch (e) {
    console.error(`RSS Feed not generated: ${JSON.stringify(e)}`);
    process.exit(1);
  }
}

main();
