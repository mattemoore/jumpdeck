import { Trans } from 'next-i18next';
import { cva } from 'cva';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';
import If from '~/core/ui/If';

import { isRouteActive } from '~/core/is-route-active';
import NAVIGATION_CONFIG from '../../../navigation.config';
import classNames from 'classnames';

function AppSidebarNavigation({
  collapsed,
}: React.PropsWithChildren<{
  collapsed: boolean;
}>) {
  const iconClassName = getSidebarIconClassBuilder()({
    collapsed,
  });

  return (
    <div className={'flex flex-col space-y-1.5'}>
      {NAVIGATION_CONFIG.items.map((item) => {
        const Label = <Trans i18nKey={item.label} defaults={item.label} />;

        return (
          <AppSidebarItem
            key={item.path}
            href={item.path}
            collapsed={collapsed}
          >
            <If
              condition={collapsed}
              fallback={<item.Icon className={iconClassName} />}
            >
              <Tooltip>
                <TooltipTrigger>
                  <item.Icon className={iconClassName} />
                </TooltipTrigger>

                <TooltipContent side={'right'} sideOffset={20}>
                  {Label}
                </TooltipContent>
              </Tooltip>
            </If>

            <span>{Label}</span>
          </AppSidebarItem>
        );
      })}
    </div>
  );
}

function AppSidebarItem({
  children,
  href,
  collapsed,
  shallow,
}: React.PropsWithChildren<{
  href: string;
  collapsed: boolean;
  shallow?: boolean;
}>) {
  const router = useRouter();
  const depth = 3;
  const active = isRouteActive(href, router.asPath, depth);

  const className = getSidebarItemClassBuilder()({
    collapsed,
    active,
  });

  return (
    <Link
      href={href}
      shallow={shallow ?? active}
      className={classNames(className, {
        'active group': active,
      })}
    >
      {children}
    </Link>
  );
}

export default AppSidebarNavigation;

function getSidebarItemClassBuilder() {
  return cva(
    [
      `flex w-full items-center rounded-md border-transparent text-sm font-medium text-gray-600 transition-colors duration-300`,
    ],
    {
      variants: {
        collapsed: {
          true: `justify-center space-x-0 px-0.5 py-2 [&>span]:hidden`,
          false: `py-2 px-3 pr-12 space-x-2.5`,
        },
        active: {
          true: `bg-primary-50 font-medium text-current dark:bg-primary-300/10 dark:text-primary-contrast`,
          false: `text-gray-600 ring-transparent hover:bg-gray-50 active:bg-gray-200 dark:bg-black-500 dark:text-gray-300 dark:hover:bg-black-400 dark:hover:text-white dark:active:bg-black-300 dark:active:bg-black-300`,
        },
      },
      compoundVariants: [
        {
          collapsed: true,
          active: true,
          className: `bg-primary-500/5 dark:bg-primary-500/10 !text-primary-500`,
        },
        {
          collapsed: false,
          active: true,
          className: `bg-primary-50 font-medium text-current dark:bg-primary-300/10 dark:text-primary-contrast [&>svg]:text-primary-500`,
        },
        {
          collapsed: true,
          active: false,
          className: `text-gray-600 dark:text-primary-contrast`,
        },
      ],
    }
  );
}

function getSidebarIconClassBuilder() {
  return cva(['group-[.active]:text-primary-500'], {
    variants: {
      collapsed: {
        true: `h-7`,
        false: `h-6`,
      },
    },
  });
}
