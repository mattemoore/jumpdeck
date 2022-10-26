import Head from 'next/head';
import React from 'react';

import { getStructuredData } from '~/core/blog/structured-data';
import configuration from '~/configuration';

import Post from '~/core/blog/types/post';
import Layout from '~/core/ui/Layout';
import SectionSeparator from '~/core/ui/SectionSeparator';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import If from '~/core/ui/If';
import Badge from '~/core/ui/Badge';

import PostBody from './PostBody';
import PostHeader from './PostHeader';
import PostsList from './PostsList';
import CollectionName from './CollectionName';
import SiteHeader from '../SiteHeader';
import Collection from '~/core/blog/types/collection';

const Post: React.FCC<{
  post: Post;
  morePosts: Post[];
  content: string;
}> = ({ post, morePosts, content }) => {
  return (
    <Layout>
      <PostHead post={post} />

      <SiteHeader />

      <Container>
        <div className={'mx-auto max-w-2xl'}>
          <article className="mb-16">
            <PostHeader post={post} />

            <div className={'mx-auto flex justify-center md:mt-2'}>
              <PostBody content={content} />
            </div>
          </article>

          <If condition={morePosts.length}>
            <MorePostsList posts={morePosts} collection={post.collection} />
          </If>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

function MorePostsList({
  posts,
  collection,
}: React.PropsWithChildren<{
  posts: Post[];
  collection: Collection;
}>) {
  return (
    <div>
      <SectionSeparator />

      <h3 className="my-4 flex flex-row items-center justify-center space-x-4 text-center font-semibold dark:text-white md:my-12">
        <span>Read more about</span>{' '}
        <Badge>
          <CollectionName logoSize={28} collection={collection} />
        </Badge>
      </h3>

      <PostsList small posts={posts} />
    </div>
  );
}

function PostHead({ post }: React.PropsWithChildren<{ post: Post }>) {
  const ogImage = post.ogImage?.url ?? post.coverImage;
  const title = post.title;
  const siteUrl = configuration.site.siteUrl;
  const fullImagePath = `${siteUrl}${ogImage}`;
  const creator = configuration.site.twitterHandle;
  const siteName = configuration.site.siteName;

  const structuredDataJson = getStructuredData({
    type: 'Article',
    id: 'https://google.com/article',
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    imagePath: fullImagePath,
    author: {
      type: `Organization`,
      name: siteName,
      url: siteUrl,
    },
  });

  return (
    <Head>
      <title>{title}</title>

      <meta key="og:type" property="og:type" content="article" />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:site_name" property="og:site_name" content={siteName} />

      <meta
        key="article:published_time"
        property="article:published_time"
        content={post.date}
      />

      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="twitter:image" name="twitter:image" content={fullImagePath} />
      <meta key="twitter:site" name="twitter:site" content={creator} />

      {post.excerpt && (
        <>
          <meta
            key="twitter:description"
            name="twitter:description"
            content={post.excerpt}
          />

          <meta
            key="og:description"
            property="og:description"
            content={post.excerpt}
          />

          <meta
            key="meta:description"
            name="description"
            content={post.excerpt}
          />
        </>
      )}

      {post.canonical && (
        <link rel="canonical" href={post.canonical} key="canonical" />
      )}

      {fullImagePath && (
        <meta key={'og:image'} property="og:image" content={fullImagePath} />
      )}

      <script
        key="ld:json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataJson),
        }}
      />
    </Head>
  );
}

export default Post;
