import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Trans } from 'next-i18next';

import type { User } from 'firebase/auth';

import {
  Squares2X2Icon,
  DocumentIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';

import { useUserSession } from '~/core/hooks/use-user-session';
import { isRouteActive } from '~/core/is-route-active';
import configuration from '~/configuration';

const OrganizationsSelector = dynamic(
  () => import('../../organizations/OrganizationsSelector'),
  {
    ssr: false,
  }
);

const AppSidebar = () => {
  const userSession = useUserSession();

  return (
    <div
      className={'AppSidebar w-2/12 max-w-xs sm:min-w-[12rem] lg:min-w-[16rem]'}
    >
      <AppSidebarHeader user={userSession?.auth} />
      <AppSidebarFooterMenu />
    </div>
  );
};

function AppSidebarHeader({
  user,
}: React.PropsWithChildren<{ user: Maybe<User> }>) {
  const logoHref = configuration.paths.appHome;

  return (
    <div className={'flex w-full flex-col space-y-6 px-4'}>
      <div className={'flex justify-center px-3 py-0.5'}>
        <Logo href={logoHref} />
      </div>

      <div className={'w-full'}>
        <If condition={user}>
          {({ uid: userId }) => <OrganizationsSelector userId={userId} />}
        </If>
      </div>

      <AppSidebarMenu />
    </div>
  );
}

function AppSidebarMenu() {
  return (
    <div className={'flex flex-col space-y-2'}>
      <AppSidebarItem href={configuration.paths.appHome}>
        <Squares2X2Icon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:dashboardTabLabel'} />
        </span>
      </AppSidebarItem>

      <AppSidebarItem href={'/settings'}>
        <Cog8ToothIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:settingsTabLabel'} />
        </span>
      </AppSidebarItem>
    </div>
  );
}

function AppSidebarFooterMenu() {
  return (
    <div className={'absolute bottom-8 w-full px-6'}>
      <div className={'flex flex-col space-y-4'}>
        <FooterItem href={'/docs'}>
          <DocumentIcon className={'h-4'} />
          <span>Documentation</span>
        </FooterItem>
      </div>
    </div>
  );
}

function AppSidebarItem({
  children,
  href,
  shallow,
}: React.PropsWithChildren<{
  href: string;
  shallow?: boolean;
}>) {
  const router = useRouter();
  const depth = 3;
  const active = isRouteActive(href, router.pathname, depth);

  return (
    <Link href={href} passHref shallow={shallow ?? true}>
      <a
        className={`AppSidebarItem ${
          active ? `AppSidebarItemActive` : 'AppSidebarItemNotActive'
        }`}
      >
        {children}
      </a>
    </Link>
  );
}

function FooterItem({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} passHref>
      <a className={'AppSidebarFooterItem'}>{children}</a>
    </Link>
  );
}

export default AppSidebar;
