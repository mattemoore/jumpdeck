import { useContext } from 'react';

import Link from 'next/link';
import { Trans } from 'next-i18next';
import classNames from 'classnames';

import {
  DocumentIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/outline';

import Logo from '~/core/ui/Logo';
import LogoMini from '~/core/ui/Logo/LogoMini';
import IconButton from '~/core/ui/IconButton';
import Tooltip from '~/core/ui/Tooltip';

import configuration from '~/configuration';
import { SidebarContext } from '~/lib/contexts/sidebar';
import AppSidebarNavigation from './AppSidebarNavigation';

const AppSidebar: React.FC = () => {
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  return (
    <div
      className={classNames('AppSidebar', {
        ['AppSidebarCollapsed w-[5rem]']: collapsed,
        [`w-2/12 max-w-xs sm:min-w-[12rem] lg:min-w-[16rem]`]: !collapsed,
      })}
    >
      <div className={'flex w-full flex-col space-y-7 px-3'}>
        <AppSidebarHeader collapsed={collapsed} />
        <AppSidebarNavigation collapsed={collapsed} />
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
