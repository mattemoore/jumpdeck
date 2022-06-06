import Head from 'next/head';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import configuration from '~/configuration';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import Footer from '~/components/Footer';

import SiteHeader from '../components/SiteHeader';
import GridList from '~/components/blog/GridList';
import SubHeading from '~/core/ui/SubHeading';

const Question: React.FCC = ({ children }) => {
  return (
    <div>
      <Heading type={2}>{children}</Heading>
    </div>
  );
};

const DATA = [
  {
    question: `Here goes a question`,
    answer: `<p>And here is the answer</p>`,
  },
];

const Faq = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DATA.map((item) => {
      return {
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      };
    }),
  };

  return (
    <>
      <Layout>
        <Head>
          <title key="title">FAQ - {configuration.site.name}</title>

          <script
            key={'ld:json'}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>

        <SiteHeader />

        <Container>
          <Hero>FAQ</Hero>

          <SubHeading>Frequently Asked Questions</SubHeading>

          <div className={'my-8'}>
            <GridList>
              {DATA.map((item, index) => {
                return (
                  <div
                    className={'rounded-xl bg-gray-50 p-8 dark:bg-black-400'}
                    key={index}
                  >
                    <Question>
                      <span className={'font-semibold dark:text-white'}>
                        {item.question}
                      </span>
                    </Question>

                    <div
                      className={
                        'flex flex-col space-y-4 py-4 text-lg lg:text-xl' +
                        ' dark:text-gray-400'
                      }
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                );
              })}
            </GridList>
          </div>
        </Container>

        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticProps() {
  const { props } = await withTranslationProps();

  return {
    props,
  };
}

export default Faq;
