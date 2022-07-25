import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import type { User } from 'firebase/auth';

import {
  ViewGridIcon,
  DocumentIcon,
  SupportIcon,
  CogIcon,
} from '@heroicons/react/outline';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';
import { Trans } from 'next-i18next';

import { useUserSession } from '~/lib/hooks/use-user-session';
import { isRouteActive } from '~/core/is-route-active';

const OrganizationsSelector = dynamic(
  () => import('../../OrganizationsSelector'),
  {
    ssr: false,
  }
);

const AppSidebar = () => {
  const userSession = useUserSession();

  const style = {
    maxWidth: '240px',
    minWidth: '180px',
    width: '20%',
  };

  return (
    <div style={style} className={'AppSidebar'}>
      <AppSidebarHeader user={userSession?.auth} />
      <AppSidebarFooterMenu />
    </div>
  );
};

function AppSidebarHeader({
  user,
}: React.PropsWithChildren<{ user: Maybe<User> }>) {
  const logoHref = '/dashboard';

  return (
    <div className={'flex w-full flex-col space-y-6 px-4'}>
      <div className={'px-3 py-0'}>
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
      <AppSidebarItem href={'/dashboard'}>
        <ViewGridIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:dashboardTabLabel'} />
        </span>
      </AppSidebarItem>

      <AppSidebarItem href={'/settings'}>
        <CogIcon className={'h-6'} />

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

        <FooterItem href={'/help'}>
          <SupportIcon className={'h-4'} />
          <span>Help</span>
        </FooterItem>
      </div>
    </div>
  );
}

function AppSidebarItem({
  children,
  href,
}: React.PropsWithChildren<{
  href: string;
}>) {
  const router = useRouter();
  const depth = 2;
  const active = isRouteActive(href, router.pathname, depth);

  return (
    <Link href={href} passHref>
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
