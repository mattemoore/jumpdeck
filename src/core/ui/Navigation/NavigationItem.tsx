import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trans } from 'next-i18next';
import classNames from 'classnames';

import { isRouteActive } from '~/core/is-route-active';

interface Link {
  path: string;
  label?: string;

  /**
   * @deprecated - Simply use {@link label}
   */
  i18n?: string;
}

const NavigationMenuItem: React.FCC<{
  link: Link;
  depth?: number;
  disabled?: boolean;
  shallow?: boolean;
  className?: string;
}> = ({ link, className, disabled, shallow, depth }) => {
  const router = useRouter();
  const active = isRouteActive(link.path, router.asPath, depth ?? 1);
  const label = link.label ?? link.i18n;

  return (
    <div
      className={classNames(`NavigationItem`, className ?? ``, {
        [`NavigationItemActive`]: active,
        [`NavigationItemNotActive`]: !active,
      })}
    >
      <Link
        aria-disabled={disabled}
        href={disabled ? '' : link.path}
        shallow={shallow ?? active}
      >
        <Trans i18nKey={label} defaults={label} />
      </Link>
    </div>
  );
};

export default NavigationMenuItem;
