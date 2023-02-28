import Head from 'next/head';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import classNames from 'classnames';
import { GetStaticPropsContext } from 'next';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import configuration from '~/configuration';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';

import Footer from '~/components/Footer';
import SiteHeader from '../components/SiteHeader';
import IconButton from '~/core/ui/IconButton';

const DATA = [
  {
    question: `Do you offer a free trial?`,
    answer: `Yes, we offer a 14-day free trial. You can cancel at any time during the trial period and you won't be charged.`,
  },
  {
    question: `Can I cancel my subscription?`,
    answer: `You can cancel your subscription at any time. You can do this from your account settings.`,
  },
  {
    question: `Where can I find my invoices?`,
    answer: `You can find your invoices in your account settings.`,
  },
  {
    question: `What payment methods do you accept?`,
    answer: `We accept all major credit cards and PayPal.`,
  },
  {
    question: `Can I upgrade or downgrade my plan?`,
    answer: `Yes, you can upgrade or downgrade your plan at any time. You can do this from your account settings.`,
  },
  {
    question: `Do you offer discounts for non-profits?`,
    answer: `Yes, we offer a 50% discount for non-profits. Please contact us to learn more.`,
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
    <Layout>
      <Head>
        <title key="title">{`FAQ - ${configuration.site.siteName}`}</title>

        <script
          key={'ld:json'}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <SiteHeader />

      <Container>
        <div className={'flex flex-col space-y-8'}>
          <div className={'flex flex-col items-center'}>
            <Hero>FAQ</Hero>

            <SubHeading>Frequently Asked Questions</SubHeading>
          </div>

          <div
            className={
              'm-auto flex w-full max-w-xl items-center justify-center'
            }
          >
            <div className="flex w-full flex-col">
              {DATA.map((item, index) => {
                return <FaqItem key={index} item={item} />;
              })}
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

function FaqItem({
  item,
}: React.PropsWithChildren<{
  item: {
    question: string;
    answer: string;
  };
}>) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded((isExpanded) => !isExpanded);

  return (
    <div className={'border-b border-gray-100 py-4 px-2 dark:border-black-300'}>
      <div className={'flex justify-between'}>
        <Heading type={2}>
          <span
            onClick={toggle}
            className={
              'text-base font-semibold text-gray-700 hover:text-current' +
              ' cursor-pointer dark:text-gray-300' +
              ' dark:hover:text-white'
            }
          >
            {item.question}
          </span>
        </Heading>

        <div>
          <IconButton onClick={toggle}>
            {expanded ? (
              <MinusIcon className={'h-5'} />
            ) : (
              <PlusIcon className={'h-5'} />
            )}
          </IconButton>
        </div>
      </div>

      <div
        className={classNames(
          'flex flex-col space-y-2 py-1 text-sm text-gray-500 dark:text-gray-400',
          {
            hidden: !expanded,
          }
        )}
        dangerouslySetInnerHTML={{ __html: item.answer }}
      />
    </div>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { props } = await withTranslationProps({ locale });

  return {
    props,
  };
}

export default Faq;
