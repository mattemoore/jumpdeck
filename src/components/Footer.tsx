import Link from 'next/link';

import Container from '~/core/ui/Container';
import LogoImage from '~/core/ui/Logo/LogoImage';
import TwitterLogo from '~/core/ui/TwitterLogo';
import configuration from '~/configuration';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={'Footer'}>
      <Container>
        <div
          className={
            'flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0' +
            ' md:justify-between'
          }
        >
          <div className={'flex w-4/12 items-center space-x-8'}>
            <LogoImage className={'w-[55px] md:w-[75px]'} />

            <Link
              href={`https://twitter.com/${configuration.site.twitterHandle}`}
              passHref
            >
              <a target={'_blank'} rel="nofollow noopener">
                <TwitterLogo />
              </a>
            </Link>
          </div>

          <div className={'flex flex-col space-y-1 text-sm'}>
            <p>
              © Copyright {year} {configuration.site.siteName}. All Rights
              Reserved.
            </p>

            <div className={'flex flex-row space-x-2'}>
              <Link href={'#'}>Terms of Service</Link>

              <span>|</span>

              <Link href={'#'}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
