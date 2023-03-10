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
    <RecoilRoot>
      <>
        <div
          id="appWrapper"
          className="flex flex-col bg-neutral-100 font-normal text-gray-800/80"
        >
          <div
            id="signatureSettingsMenu"
            className="flex h-14 flex-row justify-center bg-white/90 p-2"
          >
            <SignatureSettingsMenuBar />
          </div>
          <div
            id="signatureDetailsAndPreviewWrapper"
            className="border-gray/10 flex flex-col border-t border-b lg:flex-row"
          >
            <div
              id="signatureCreationOptions"
              className="border-gray/10 m-8 flex flex-col rounded-sm border bg-white/90 p-2 lg:w-1/4"
            >
              <SignatureDetailsList />
            </div>
            <div
              id="signaturePreview"
              className="border-gray/10 m-8 flex flex-col items-center rounded-sm border bg-white/90 p-2 lg:w-3/4"
            >
              <SignaturePreview />
            </div>
          </div>
          <div id="footer">
            <div className="flex h-14 flex-col bg-white/90 p-2">
              <SignatureSettingsFooter />
            </div>
          </div>
        </div>
      </>
    </RecoilRoot>
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
