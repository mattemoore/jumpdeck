import Link from 'next/link';

import Container from '~/core/ui/Container';
import LogoImage from '~/core/ui/Logo/LogoImage';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import TwitterLogo from '~/core/ui/TwitterLogo';
import GithubLogo from '~/core/ui/GithubLogo';
import configuration from '~/configuration';

const links = {
  Docs: {
    path: '/docs',
    label: 'Docs',
  },
  Contact: {
    path: '/contact',
    label: 'Contact',
  },
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={'Footer'}>
      <Container>
        <div className={'flex items-center'}>
          <div className={'flex flex-1 items-center space-x-4 md:space-x-12'}>
            <span className={'flex items-center space-x-2 text-sm'}>
              <LogoImage className={'w-[55px] sm:w-[55px]'} />
              <span>-</span>
              <span>{year}</span>
            </span>

            <div className={'flex items-center space-x-6'}>
              <Link
                href={`https://twitter.com/${configuration.site.twitterHandle}`}
                passHref
              >
                <a target={'_blank'} rel="nofollow noopener">
                  <TwitterLogo className={'dark:fill-white'} />
                </a>
              </Link>

              <Link
                href={`https://github.com/${configuration.site.githubHandle}`}
                passHref
              >
                <a target={'_blank'} rel="nofollow noopener">
                  <GithubLogo fill={'white'} />
                </a>
              </Link>
            </div>
          </div>

          <div className={'flex hidden justify-end md:flex'}>
            <ul className={'flex flex-row items-center space-x-4'}>
              <NavigationItem link={links.Docs} />
              <NavigationItem link={links.Contact} />
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
