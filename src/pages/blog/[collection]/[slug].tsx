import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import {
  getPostsByCollection,
  getAllPosts,
  getPostBySlug,
} from '~/core/blog/api';

import PostType from '~/core/blog/types/post';
import Post from '~/components/blog/Post';
import { compileMdx } from '~/core/generic/compile-mdx';

type Props = {
  post: PostType;
  morePosts: PostType[];
  content: string;
};

const PostPage = ({ post, morePosts, content }: Props) => {
  const router = useRouter();

  if (!router.isFallback && (!post?.slug || !post.collection)) {
    return <ErrorPage statusCode={404} />;
  }

  return <Post content={content} post={post} morePosts={morePosts} />;
};

export default PostPage;

type Params = {
  params: {
    slug: string;
    collection: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { slug, collection } = params;
  const { props } = await withTranslationProps();

  const maxReadMorePosts = 6;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const morePosts = getPostsByCollection(collection)
    .filter((item) => item.slug !== slug)
    .slice(0, maxReadMorePosts);

  const content = await compileMdx(post.content ?? '');

  return {
    props: {
      ...props,
      post,
      content,
      morePosts,
    },
  };
}

export function getStaticPaths() {
  const posts = getAllPosts();

  const paths = posts.map((post) => {
    const slug = post.slug;
    const collection = post.collection.name.toLowerCase();

    return {
      params: {
        collection,
        slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
