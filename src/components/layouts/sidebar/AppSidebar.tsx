import { useContext } from 'react';

import Link from 'next/link';
import { Trans } from 'next-i18next';
import classNames from 'classnames';
import { cva } from 'cva';

import {
  DocumentIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/outline';

import Logo from '~/core/ui/Logo';
import LogoMini from '~/core/ui/Logo/LogoMini';
import IconButton from '~/core/ui/IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

import configuration from '~/configuration';
import { SidebarContext } from '~/core/contexts/sidebar';
import AppSidebarNavigation from './AppSidebarNavigation';

const AppSidebar: React.FC = () => {
  const { collapsed, setCollapsed } = useContext(SidebarContext);
  const className = getClassNameBuilder()({
    collapsed,
  });

  return (
    <div className={className}>
      <div className={'flex w-full flex-col space-y-7 px-4'}>
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
    <div className={'flex px-2.5 py-1'}>
      {collapsed ? <LogoMini href={logoHref} /> : <Logo href={logoHref} />}
    </div>
  );
}

function AppSidebarFooterMenu({
  collapsed,
  setCollapsed,
}: React.PropsWithChildren<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>) {
  return (
    <div
      className={classNames(`absolute bottom-8 w-full`, {
        ['px-6']: !collapsed,
        ['flex justify-center px-2']: collapsed,
      })}
    >
      <div className={'flex flex-col space-y-6'}>
        <FooterLinkItem collapsed={collapsed} href={'/docs'}>
          <DocumentIcon className={'h-5'} />

          <span>
            <Trans i18nKey={'common:documentation'} />
          </span>
        </FooterLinkItem>

        <FooterLinkItem>
          <CollapsibleButton collapsed={collapsed} onClick={setCollapsed} />
        </FooterLinkItem>
      </div>
    </div>
  );
}

function FooterLinkItem({
  children,
  href,
  collapsed,
}: React.PropsWithChildren<{ href?: string; collapsed?: boolean }>) {
  const className = classNames(
    `flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white`,
    {
      '[&>span]:hidden w-full justify-center': collapsed,
    }
  );

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

function CollapsibleButton(
  props: React.PropsWithChildren<{
    collapsed: boolean;
    onClick: (collapsed: boolean) => void;
  }>
) {
  if (props.collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            className={'w-full justify-center'}
            onClick={() => props.onClick(!props.collapsed)}
          >
            <ArrowRightCircleIcon className={'h-6'} />
          </IconButton>
        </TooltipTrigger>

        <TooltipContent>
          <Trans i18nKey={'common:expandSidebar'} />
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      className={classNames('flex bg-transparent', {
        'justify-center space-x-0 [&>span]:hidden': props.collapsed,
        'items-center space-x-2': !props.collapsed,
      })}
      onClick={() => props.onClick(!props.collapsed)}
    >
      <ArrowLeftCircleIcon className={'h-6'} />

      <span>
        <Trans i18nKey={'common:collapseSidebar'} />
      </span>
    </button>
  );
}

export default AppSidebar;

function getClassNameBuilder() {
  return cva(
    [
      'relative flex hidden h-screen flex-row justify-center border-r border-gray-100 py-4 dark:border-black-300 dark:bg-black-500 lg:flex',
    ],
    {
      variants: {
        collapsed: {
          true: `w-[5rem]`,
          false: `w-2/12 max-w-xs sm:min-w-[12rem] lg:min-w-[17rem]`,
        },
      },
    }
  );
}
