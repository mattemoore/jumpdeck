import Head from 'next/head';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import SiteHeader from '~/components/SiteHeader';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';
import Footer from '~/components/Footer';

const Price: React.FCC = ({ children }) => {
  return (
    <p className={'my-8 text-center text-6xl font-bold dark:text-white'}>
      {children}
    </p>
  );
};

const ListItem: React.FCC = ({ children }) => {
  return (
    <li className={'flex items-center space-x-3 font-medium'}>
      <div>
        <CheckCircleIcon className={'h-7'} />
      </div>

      <span>{children}</span>
    </li>
  );
};

const Pricing = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Pricing - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <Container>
          <Hero>Pricing</Hero>
          <SubHeading>Fair pricing for your customers</SubHeading>

          <div
            className={
              'mt-12 flex space-y-6 lg:space-y-0' +
              ' flex-col lg:flex-row' +
              ' items-start items-stretch justify-center lg:space-x-4'
            }
          >
            <div
              className={
                'rounded-2xl border-2 border-white shadow-sm xl:w-4/12 ' +
                'relative bg-gray-50 p-5 text-black-400 md:p-6 xl:p-8'
              }
            >
              <div className={'flex flex-col space-y-2'}>
                <Heading type={1}>
                  <span>Maker</span>
                </Heading>

                <SubHeading>
                  <span className={'text-gray-600'}>
                    Lifetime license, Email/Chat support for makers and small
                    teams
                  </span>
                </SubHeading>
              </div>

              <Price>
                <span className={'text-black-400'}>$249</span>
              </Price>

              <div className={'my-12 flex flex-col space-y-6 pb-6'}>
                <div>
                  <ul className={'flex flex-col space-y-2'}>
                    <ListItem>Access to up to 2 users</ListItem>

                    <ListItem>Access to all the kits</ListItem>

                    <ListItem>
                      <b>1-hour</b> onboarding and set-up
                    </ListItem>

                    <ListItem>Support via Chat and Email</ListItem>
                  </ul>
                </div>
              </div>

              <div className={'absolute bottom-0 left-0 w-full p-6'}>
                <Button disabled block>
                  Get Started
                </Button>
              </div>
            </div>

            <div
              className={
                'rounded-2xl border-2 border-[#1d4ed8] text-white' +
                ' bg-[#1d4ed8]' +
                ' p-5 md:p-6 xl:w-4/12 xl:p-8' +
                ' relative'
              }
            >
              <div className={'flex flex-col space-y-2'}>
                <Heading type={1}>Team</Heading>

                <SubHeading>
                  <span className={'text-gray-50'}>
                    Lifetime license, Email/Chat support for teams and startups
                  </span>
                </SubHeading>
              </div>

              <Price>$999</Price>

              <div className={'my-12 flex flex-col space-y-6 pb-6'}>
                <ul className={'flex flex-col space-y-2'}>
                  <ListItem>Access to unlimited users</ListItem>
                  <ListItem>Access to all the kits</ListItem>

                  <ListItem>
                    <b>4-hour</b> onboarding and set-up
                  </ListItem>

                  <ListItem>Support via Chat and Email</ListItem>
                </ul>
              </div>

              <div className={'absolute bottom-0 left-0 w-full p-6'}>
                <Button disabled block>
                  Get Started
                </Button>
              </div>
            </div>
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

export default Pricing;
