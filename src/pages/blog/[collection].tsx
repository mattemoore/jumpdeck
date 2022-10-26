import Head from 'next/head';
import Link from 'next/link';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import PostTitle from '~/components/blog/PostTitle';
import PostsList from '~/components/blog/PostsList';
import SiteHeader from '~/components/SiteHeader';

import {
  getPostsByCollection,
  getCollections,
  getCollectionByName,
} from '~/core/blog/api';

import Post from '~/core/blog/types/post';
import Collection from '~/core/blog/types/collection';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import If from '~/core/ui/If';

type Props = {
  posts: Post[];
  collection: Collection;
};

const CollectionPosts = ({ posts, collection }: Props) => {
  return (
    <Layout>
      <Head>
        <title key="title">{collection.name}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SiteHeader />

      <Container>
        <PostTitle>
          <span className={'flex space-x-2'}>
            <Link className={'hover:underline'} href={'/blog'}>
              Blog
            </Link>
            <span>/</span>
            <span>{collection.name}</span>
          </span>
        </PostTitle>

        <div className="mt-8 flex flex-col space-y-8 md:mt-12">
          <If condition={posts.length}>
            <PostsList posts={posts} />
          </If>
        </div>
      </Container>
    </Layout>
  );
};

export default CollectionPosts;

type Params = {
  params: {
    slug: string;
    collection: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { props } = await withTranslationProps();
  const collection = getCollectionByName(params.collection);
  const posts = getPostsByCollection(params.collection);

  return {
    props: {
      ...props,
      posts,
      collection,
    },
  };
}

export function getStaticPaths() {
  const paths = getCollections().map((collection) => {
    const collectionName = collection?.name.toLowerCase();

    return {
      params: {
        collection: collectionName,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
