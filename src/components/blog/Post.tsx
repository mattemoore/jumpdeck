import Head from 'next/head';

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

const Post: React.FC<{
  post: Post;
  morePosts: Post[];
  content: string;
}> = ({ post, morePosts, content }) => {
  const title = post.title;
  const ogImage = post.ogImage?.url ?? post.coverImage;
  const collection = post.collection;
  const fullImagePath = `${configuration.site.siteUrl}${ogImage}`;

  const structuredDataJson = getStructuredData({
    type: 'Article',
    id: 'https://google.com/article',
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    imagePath: fullImagePath,
    author: {
      name: configuration.site.siteName,
      url: configuration.site.siteUrl,
    },
  });

  return (
    <Layout>
      <Head>
        <title>{title}</title>

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} key="og:title" />
        <meta property="article:published_time" content={post.date} />

        <meta key="twitter:title" property="twitter:title" content={title} />

        <meta
          key="twitter:image"
          property="twitter:image"
          content={fullImagePath}
        />

        <If condition={post.excerpt}>
          <>
            <meta
              key="twitter:description"
              property="twitter:description"
              content={post.excerpt}
            />

            <meta
              property="og:description"
              content={post.excerpt}
              key="og:description"
            />

            <meta
              name="description"
              content={post.excerpt}
              key="meta:description"
            />
          </>
        </If>

        <If condition={post.canonical}>
          <link rel="canonical" href={post.canonical} key="canonical" />
        </If>

        <If condition={ogImage}>
          <meta property="og:image" content={ogImage} />
        </If>

        <script
          key="ld:json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataJson),
          }}
        />
      </Head>

      <SiteHeader />

      <Container>
        <div className={'max-w-2xl mx-auto'}>
          <article className="mb-16">
            <PostHeader post={post} />

            <div className={'mx-auto mt-8 flex justify-center'}>
              <PostBody content={content} />
            </div>
          </article>

          <If condition={morePosts.length}>
            <div>
              <SectionSeparator />

              <h3 className="text-center font-semibold my-4 md:my-12 flex flex-row space-x-4 items-center justify-center dark:text-white">
                <span>Read more about</span>{' '}
                <Badge>
                  <CollectionName logoSize="28px" collection={collection} />
                </Badge>
              </h3>

              <PostsList posts={morePosts} />
            </div>
          </If>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

export default Post;
