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

import { RecoilRoot } from 'recoil';
import SignatureSettingsMenuBar from '~/components/signitto/SignatureSettingsMenuBar';
import SignaturePreview from '~/components/signitto/SignaturePreview';
import SignatureDetailsList from '~/components/signitto/SignatureDetailsList';
import SignatureSettingsFooter from '~/components/signitto/SignatureSettingsFooter';

function Signitto(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title key="title">{`Blog - ${configuration.site.siteName}`}</title>
      </Head>

      <SiteHeader />
      <RecoilRoot>
        <>
          <div id="appWrapper" className="flex flex-col">
            <div id="signatureSettingsMenu" className="h-14">
              <SignatureSettingsMenuBar />
            </div>
            <div
              id="signatureDetailsAndPreviewWrapper"
              className="flex flex-col lg:flex-row"
            >
              <div id="signatureCreationOptions" className="lg:w-1/4">
                <SignatureDetailsList />
              </div>
              <div id="signaturePreview" className="lg:w-3/4">
                <SignaturePreview />
              </div>
            </div>
            <div id="footer">
              <div className="p-2">
                <SignatureSettingsFooter />
              </div>
            </div>
          </div>
        </>
      </RecoilRoot>
    </Layout>
  );
}
export default Signitto;

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  const { props } = await withTranslationProps({ locale });

  return {
    props: {
      ...props,
      posts: getAllPosts(),
    },
  };
};
