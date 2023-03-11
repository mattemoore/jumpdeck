import Head from 'next/head';
import { GetStaticPropsContext } from 'next';
import { withTranslationProps } from '~/lib/props/with-translation-props';

import { getAllPosts } from '~/core/blog/api';
import Layout from '~/core/ui/Layout';

import { RecoilRoot } from 'recoil';
import SignatureSettingsMenuBar from '~/components/signitto/SignatureSettingsMenuBar';
import SignaturePreview from '~/components/signitto/SignaturePreview';
import SignatureDetailsList from '~/components/signitto/SignatureDetailsList';
import SignatureSettingsFooter from '~/components/signitto/SignatureSettingsFooter';

function Signitto(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title key="title">{`Signitto - Easy email signature management`}</title>
      </Head>

      <RecoilRoot>
        <>
          <div id="appWrapper" className="flex flex-col">
            <div id="signatureSettingsMenu">
              <SignatureSettingsMenuBar />
            </div>
            <div
              id="signatureDetailsAndPreviewWrapper"
              className="mb-5 flex flex-col lg:flex-row"
            >
              <div id="signatureCreationOptions" className="lg:w-1/4">
                <SignatureDetailsList />
              </div>
              <div id="signaturePreview" className="lg:w-3/4">
                <SignaturePreview />
              </div>
            </div>
            <div id="signittoFooter">
              <SignatureSettingsFooter />
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
