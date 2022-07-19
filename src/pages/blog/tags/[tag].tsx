import Head from 'next/head';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import PostsList from '~/components/blog/PostsList';
import SiteHeader from '~/components/SiteHeader';

import configuration from '~/configuration';
import { getPostsByTag, getAllTags } from '~/core/blog/api';

import Post from '~/core/blog/types/post';
import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';

type Props = {
  posts: Post[];
  tag: string;
};

const TagPage = ({ posts, tag }: Props) => {
  return (
    <Layout>
      <Head>
        <title key="title">{`${tag} - ${configuration.site.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SiteHeader />

      <Container>
        <div className="flex justify-center">
          <Hero>{tag}</Hero>
        </div>

        <div className="mt-8 md:mt-12">
          <PostsList posts={posts} />
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

export default TagPage;

type Params = {
  params: {
    tag: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const posts = getPostsByTag(params.tag);
  const { props } = await withTranslationProps();

  return {
    props: {
      ...props,
      posts,
      tag: params.tag,
    },
  };
}

export function getStaticPaths() {
  const paths = getAllTags().map((tag) => {
    return {
      params: {
        tag,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
