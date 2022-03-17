import { useRouter } from 'next/router';
import Link from 'next/link';
import type { User } from 'firebase/auth';

import {
  UserIcon,
  UserGroupIcon,
  ViewGridIcon,
  CreditCardIcon,
  DocumentIcon,
  SupportIcon,
} from '@heroicons/react/outline';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';

import { useUserSession } from '~/lib/hooks/use-user-session';

import OrganizationsSelector from '../../OrganizationsSelector';
import { Trans } from 'next-i18next';

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
    <div className={'flex w-full flex-col px-4 space-y-6'}>
      <div className={'px-3 py-0'}>
        <Logo href={logoHref} />
      </div>

      <div className={'w-full'} suppressHydrationWarning>
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

      <AppSidebarItem href={'/settings/organization'}>
        <UserGroupIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:organizationSettingsTabLabel'} />
        </span>
      </AppSidebarItem>

      <AppSidebarItem href={'/settings/profile'}>
        <UserIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:profileSettingsTabLabel'} />
        </span>
      </AppSidebarItem>

      <AppSidebarItem href={'/settings/subscription'}>
        <CreditCardIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:subscriptionSettingsTabLabel'} />
        </span>
      </AppSidebarItem>
    </div>
  );
}

function AppSidebarFooterMenu() {
  return (
    <div className={'absolute w-full bottom-8 px-6'}>
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
  const active = router.pathname === href;

  return (
    <Link href={href} passHref shallow>
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
