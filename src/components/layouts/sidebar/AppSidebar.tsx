import { useContext } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trans } from 'next-i18next';
import classNames from 'classnames';

import {
  Squares2X2Icon,
  DocumentIcon,
  Cog8ToothIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/outline';

import Logo from '~/core/ui/Logo';
import LogoMini from '~/core/ui/Logo/LogoMini';
import IconButton from '~/core/ui/IconButton';
import Tooltip from '~/core/ui/Tooltip';

import { isRouteActive } from '~/core/is-route-active';
import configuration from '~/configuration';
import { SidebarContext } from '~/lib/contexts/sidebar';

const AppSidebar: React.FC = () => {
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  return (
    <div
      className={classNames('AppSidebar', {
        ['AppSidebarCollapsed w-[5rem]']: collapsed,
        [`w-2/12 max-w-xs sm:min-w-[12rem] lg:min-w-[16rem]`]: !collapsed,
      })}
    >
      <div
        className={classNames('flex w-full flex-col space-y-6', {
          ['px-3']: collapsed,
          ['px-4']: !collapsed,
        })}
      >
        <AppSidebarHeader collapsed={collapsed} />
        <AppSidebarMenu collapsed={collapsed} />
      </div>

      <AppSidebarFooterMenu collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  );
};

function AppSidebarHeader({
  collapsed,
}: React.PropsWithChildren<{ collapsed: boolean }>) {
  const logoHref = configuration.paths.appHome;

  return (
    <div className={'flex justify-center px-2.5 py-1'}>
      {collapsed ? <LogoMini href={logoHref} /> : <Logo href={logoHref} />}
    </div>
  );
}

function AppSidebarMenu(
  props: React.PropsWithChildren<{
    collapsed: boolean;
  }>
) {
  return (
    <div className={'flex flex-col space-y-2'}>
      <AppSidebarItem href={configuration.paths.appHome}>
        <Tooltip
          placement={'right'}
          content={
            props.collapsed ? (
              <Trans i18nKey={'common:dashboardTabLabel'} />
            ) : null
          }
        >
          <Squares2X2Icon className={'h-7'} />
        </Tooltip>

        <span>
          <Trans i18nKey={'common:dashboardTabLabel'} />
        </span>
      </AppSidebarItem>

      <AppSidebarItem href={'/settings'}>
        <Tooltip
          placement={'right'}
          content={
            props.collapsed ? (
              <Trans i18nKey={'common:settingsTabLabel'} />
            ) : null
          }
        >
          <Cog8ToothIcon className={'h-7'} />
        </Tooltip>

        <span>
          <Trans i18nKey={'common:settingsTabLabel'} />
        </span>
      </AppSidebarItem>
    </div>
  );
}

function AppSidebarFooterMenu(
  props: React.PropsWithChildren<{
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
  }>
) {
  return (
    <div
      className={classNames(`absolute bottom-8 w-full`, {
        ['px-6']: !props.collapsed,
        ['flex justify-center px-2']: props.collapsed,
      })}
    >
      <div className={'flex flex-col space-y-6'}>
        <FooterLinkItem href={'/docs'}>
          <DocumentIcon className={'h-5'} />

          <span>
            <Trans i18nKey={'common:documentation'} />
          </span>
        </FooterLinkItem>

        <div className={'AppSidebarFooterItem'}>
          <CollapsibleButton
            collapsed={props.collapsed}
            onClick={props.setCollapsed}
          />
        </div>
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
  const active = isRouteActive(href, router.asPath, depth);

  return (
    <Link href={href} passHref shallow={shallow ?? active}>
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

function FooterLinkItem({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} passHref>
      <a className={'AppSidebarFooterItem'}>{children}</a>
    </Link>
  );
}

function CollapsibleButton(
  props: React.PropsWithChildren<{
    collapsed: boolean;
    onClick: (collapsed: boolean) => void;
  }>
) {
  if (props.collapsed) {
    return (
      <Tooltip content={<Trans i18nKey={'common:expandSidebar'} />}>
        <IconButton onClick={() => props.onClick(!props.collapsed)}>
          <ArrowRightCircleIcon className={'h-6'} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <div className={'AppFooterItem'}>
      <button
        className={'flex items-center space-x-2 bg-transparent'}
        onClick={() => props.onClick(!props.collapsed)}
      >
        <ArrowLeftCircleIcon className={'h-6'} />

        <span>
          <Trans i18nKey={'common:collapseSidebar'} />
        </span>
      </button>
    </div>
  );
}

export default AppSidebar;
