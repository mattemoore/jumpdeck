import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

import configuration from '~/configuration';
import PostsList from '~/components/blog/PostsList';
import SiteHeader from '~/components/SiteHeader';
import { withTranslationProps } from '~/lib/props/with-translation-props';

import Post from '~/core/blog/types/post';

import { getAllPosts } from '~/core/blog/api';
import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import SubHeading from '~/core/ui/SubHeading';

type Props = {
  posts: Post[];
};

const Blog = ({ posts }: Props) => {
  return (
    <Layout>
      <Head>
        <title key="title">{`Blog - ${configuration.site.siteName}`}</title>
      </Head>

      <SiteHeader />

      <Container>
        <div className={'flex flex-col space-y-8'}>
          <div className={'flex flex-col items-center justify-center'}>
            <Hero>Blog</Hero>

            <SubHeading>
              Tutorials, Guides and Updates from the MakerKit team
            </SubHeading>
          </div>

          <div className="flex-col space-y-12 md:mt-8">
            <PostsList posts={posts} />
          </div>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

export default Blog;

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  const { props } = await withTranslationProps({ locale });

  return {
    props: {
      ...props,
      posts: getAllPosts(),
    },
  };
};
