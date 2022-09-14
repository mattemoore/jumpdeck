import Image from 'next/future/image';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import ConvertkitSignupForm from '~/components/newsletter/ConvertkitSignupForm';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import SiteHeader from '~/components/SiteHeader';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import Hero from '~/core/ui/Hero';

const Index = () => {
  return (
    <Layout>
      <SiteHeader />

      <Container>
        <div
          className={
            'my-8 mb-8 flex flex-col items-center md:mt-24 md:flex-row' +
            ' mx-auto flex-1 justify-center'
          }
        >
          <div
            className={'flex w-full flex-1 flex-col items-center space-y-12'}
          >
            <HeroTitle>
              <span>Tell your visitors why</span>
              <span className={'text-primary-500'}>your SaaS is awesome</span>
            </HeroTitle>

            <div className={'text-center text-gray-700 dark:text-gray-400'}>
              <SubHeading>
                Here you can write a short description of your SaaS
              </SubHeading>

              <SubHeading>
                This subheading is usually laid out on multiple lines
              </SubHeading>

              <SubHeading>Just like this.</SubHeading>
            </div>

            <Button size={'large'} href={'/auth/sign-up'}>
              Get Started for free
            </Button>
          </div>
        </div>

        <div className={'flex justify-center py-12'}>
          <Image
            className={'rounded-2xl'}
            width={800}
            height={600}
            src={`/assets/images/browser.webp`}
            alt={`App Image`}
          />
        </div>
      </Container>

      <Divider />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center space-y-24 py-12'
          }
        >
          <div className={'flex max-w-3xl flex-col items-center text-center'}>
            <b className={'text-primary-500'}>Features</b>

            <Hero>The best tool in the space</Hero>

            <SubHeading>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              malesuada nisi tellus, non imperdiet nisi tempor at.
            </SubHeading>
          </div>

          <div>
            <FeaturesGrid>
              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>
            </FeaturesGrid>
          </div>
        </div>
      </Container>

      <Divider />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center space-y-24 py-12'
          }
        >
          <div className={'flex max-w-3xl flex-col items-center text-center'}>
            <b className={'text-primary-500'}>Testimonials</b>

            <Hero>Trusted by indie-hackers all over the world</Hero>

            <SubHeading>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              malesuada nisi tellus, non imperdiet nisi tempor at.
            </SubHeading>
          </div>

          <div>
            <FeaturesGrid>
              <div className={'flex flex-col space-y-2 text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>

              <div className={'text-center'}>
                <Heading type={3}>Item</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Phasellus malesuada nisi tellus, non imperdiet nisi tempor at.
                </div>
              </div>
            </FeaturesGrid>
          </div>
        </div>
      </Container>

      <Container>
        <div className={'py-12'}>
          <div
            className={
              'flex flex-col justify-between rounded-lg md:flex-row' +
              ' space-y-2 bg-primary-50 p-8 dark:bg-primary-200 md:space-y-0'
            }
          >
            <div className={'flex items-center justify-between'}>
              <Heading type={2}>
                <p className={'text-gray-800'}>
                  The tasks application you were dreaming.
                </p>

                <p className={'text-primary-500'}>Get Started for free</p>
              </Heading>
            </div>

            <div className={'flex justify-end'}>
              <Button
                className={'w-full md:w-auto'}
                size={'large'}
                href={'/auth/sign-up'}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <NewsletterSignup />
      </Container>

      <Footer />
    </Layout>
  );
};

export default Index;

export async function getStaticProps() {
  const { props } = await withTranslationProps();

  return {
    props,
  };
}

function NewsletterSignup() {
  return (
    <div className={'flex flex-col justify-center space-y-2 py-12'}>
      <ConvertkitSignupForm formId={''}>Subscribe</ConvertkitSignupForm>

      <p className={'text-center text-xs'}>
        Subscribe to our Newsletter to receive updates
      </p>
    </div>
  );
}

function FeaturesGrid({ children }: React.PropsWithChildren) {
  return (
    <div
      className={'grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 xl:gap-16'}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <hr className={'border border-gray-50 dark:border-black-400'} />;
}

function HeroTitle({ children }: React.PropsWithChildren) {
  return (
    <h1
      className={
        'text-center text-5xl text-black-500 dark:text-current' +
        ' flex flex-col space-y-2 font-extrabold md:text-6xl' +
        ' xl:text-7xl'
      }
    >
      {children}
    </h1>
  );
}
