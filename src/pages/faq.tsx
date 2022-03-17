import Head from 'next/head';

import Link from 'next/link';

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

const Question: React.FC = ({ children }) => {
  return (
    <div>
      <Heading type={2}>{children}</Heading>
    </div>
  );
};

const DATA = [
  {
    question: `Here goes a question`,
    answer: `<p>And here sis the answer</p>`,
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
                    className={'bg-gray-50 dark:bg-black-400 p-8 rounded-xl'}
                    key={index}
                  >
                    <Question>
                      <span className={'font-semibold dark:text-white'}>
                        {item.question}
                      </span>
                    </Question>

                    <div
                      className={
                        'text-lg lg:text-xl py-4 flex flex-col space-y-4' +
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
