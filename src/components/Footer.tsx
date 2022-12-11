import Link from 'next/link';

import Container from '~/core/ui/Container';
import LogoImage from '~/core/ui/Logo/LogoImage';
import configuration from '~/configuration';
import Heading from '~/core/ui/Heading';
import NewsletterSignup from '~/components/NewsletterSignup';

const YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className={'py-8 lg:py-24'}>
      <Container>
        <div
          className={
            'flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-y-0'
          }
        >
          <div
            className={'flex w-full space-x-4 lg:w-4/12 xl:w-3/12 xl:space-x-8'}
          >
            <div className={'flex flex-col space-y-4'}>
              <div>
                <LogoImage className={'w-[85px] md:w-[115px]'} />
              </div>

              <div>
                <p className={'text-gray-500 dark:text-gray-400'}>
                  Add a short tagline about your product
                </p>
              </div>

              <div className={'flex text-xs text-gray-500 dark:text-gray-400'}>
                <p>
                  © Copyright {YEAR} {configuration.site.siteName}. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>

          <div
            className={
              'flex flex-col space-y-8 lg:space-y-0 lg:space-x-4' +
              ' xl:space-x-16 2xl:space-x-20' +
              ' w-full lg:flex-row lg:justify-end'
            }
          >
            <div>
              <div className={'flex flex-col space-y-4'}>
                <Heading type={5}>Our Company</Heading>

                <ul
                  className={
                    'flex flex-col space-y-4 text-gray-500 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link href={'#'}>Who we are</Link>
                  </li>
                  <li>
                    <Link href={'/blog'}>Blog</Link>
                  </li>
                  <li>
                    <Link href={'/contact'}>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-2.5'}>
                <Heading type={5}>Product</Heading>

                <ul
                  className={
                    'flex flex-col space-y-4 text-gray-500 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link href={'/docs'}>Documentation</Link>
                  </li>
                  <li>
                    <Link href={'#'}>Help Center</Link>
                  </li>
                  <li>
                    <Link href={'#'}>Changelog</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-4'}>
                <Heading type={5}>Legal</Heading>

                <ul
                  className={
                    'flex flex-col space-y-4 text-gray-500 dark:text-gray-400'
                  }
                >
                  <li>
                    <Link href={'#'}>Terms of Service</Link>
                  </li>
                  <li>
                    <Link href={'#'}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href={'#'}>Cookie Policy</Link>
                  </li>
                </ul>
              </div>
            </div>

            <NewsletterSignup />
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
