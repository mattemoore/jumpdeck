import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trans } from 'next-i18next';

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
  const active = isActive(link.path, router.pathname, depth ?? 1);

  const isTranslation = isLinkWithTranslation(link);
  const isLabel = isLinkWithLabel(link);

  return (
    <div
      className={`NavigationItem ${className ?? ''} ${
        active ? 'NavigationItemActive' : 'NavigationItemNotActive'
      }`}
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

function isActive(targetLink: string, currentRoute: string, depth: number) {
  if (currentRoute === '/') {
    return false;
  }

  return (
    targetLink === currentRoute ||
    hasMatchingSegments(targetLink, currentRoute, depth)
  );
}

function isLinkWithTranslation(link: Link): link is LinkWithTranslation {
  return 'i18n' in link;
}

function isLinkWithLabel(link: Link): link is LinkWithLabel {
  return 'label' in link;
}

function splitIntoSegments(href: string) {
  return href.split('/');
}

function hasMatchingSegments(
  targetLink: string,
  currentRoute: string,
  depth: number
) {
  const segments = splitIntoSegments(targetLink);
  const matchingSegments = numberOfMatchingSegments(currentRoute, segments);

  // how far back should segments be matched?
  // if depth = 1 => only highlight the links of the immediate parent
  return matchingSegments > segments.length - depth;
}

function numberOfMatchingSegments(href: string, segments: string[]) {
  let count = 0;

  for (const segment of splitIntoSegments(href)) {
    if (segments.includes(segment)) {
      count += 1;
    } else {
      return count;
    }
  }

  return count;
}

export default NavigationMenuItem;
