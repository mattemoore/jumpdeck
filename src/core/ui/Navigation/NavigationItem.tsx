import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trans } from 'next-i18next';
import classNames from 'classnames';

import { isRouteActive } from '~/core/is-route-active';

interface WithPath {
  path: string;
}

interface LinkWithLabel extends WithPath {
  label: string;
}

interface LinkWithTranslation extends WithPath {
  i18n: string;
}

type Link = LinkWithTranslation | LinkWithLabel;

const NavigationMenuItem: React.FCC<{
  link: Link;
  depth?: number;
  disabled?: boolean;
  className?: string;
}> = ({ link, className, disabled, depth }) => {
  const router = useRouter();
  const active = isRouteActive(link.path, router.pathname, depth ?? 1);

  const isTranslation = isLinkWithTranslation(link);
  const isLabel = isLinkWithLabel(link);

  return (
    <div
      className={classNames(`NavigationItem`, className ?? ``, {
        [`NavigationItemActive`]: active,
        [`NavigationItemNotActive`]: !active,
      })}
    >
      <Link href={disabled ? '' : link.path} passHref>
        <a aria-disabled={disabled}>
          {isTranslation ? <Trans i18nKey={link.i18n} /> : null}
          {isLabel ? link.label : null}
        </a>
      </Link>
    </div>
  );
};

function isLinkWithTranslation(link: Link): link is LinkWithTranslation {
  return 'i18n' in link;
}

function isLinkWithLabel(link: Link): link is LinkWithLabel {
  return 'label' in link;
}

export default NavigationMenuItem;
