import { Trans } from 'next-i18next';
import classNames from 'classnames';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Tooltip from '~/core/ui/Tooltip';
import { isRouteActive } from '~/core/is-route-active';
import NAVIGATION_CONFIG from '../../../navigation.config';

function AppSidebarNavigation({
  collapsed,
}: React.PropsWithChildren<{
  collapsed: boolean;
}>) {
  const iconClassName = classNames('AppSidebarItemIcon', {
    ['h-6']: !collapsed,
    ['h-7']: collapsed,
  });

  return (
    <div className={'flex flex-col space-y-1.5'}>
      {NAVIGATION_CONFIG.items.map((item) => {
        const Label = <Trans i18nKey={item.label} defaults={item.label} />;

        return (
          <AppSidebarItem key={item.path} href={item.path}>
            <Tooltip placement={'right'} content={collapsed ? Label : null}>
              <item.Icon className={iconClassName} />
            </Tooltip>

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
        className={classNames(`AppSidebarItem`, {
          ['AppSidebarItemActive']: active,
          ['AppSidebarItemNotActive']: !active,
        })}
      >
        {children}
      </a>
    </Link>
  );
}

export default AppSidebarNavigation;
