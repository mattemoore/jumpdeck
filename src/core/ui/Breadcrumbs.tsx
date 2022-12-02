import { useMemo } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';
import ChevronRightIcon from '@heroicons/react/20/solid/ChevronRightIcon';
import classNames from 'classnames';

import If from '~/core/ui/If';

const Breadcrumbs: React.FC<{
  className?: string;
  query?: Record<string, string | number>;
  links?: string[];
}> = (props) => {
  const router = useRouter();
  const query = useMemo(() => props.query ?? {}, [props.query]);
  const links = useMemo(() => props.links ?? [], [props.links]);

  const segments = useMemo(() => {
    return router.pathname.split('/').filter(Boolean);
  }, [router.pathname]);

  const items = useMemo(() => {
    return segments.map((item, index) => {
      const isQueryParam = item.startsWith('[') && item.endsWith(']');
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLink = links.includes(path);

      if (isQueryParam) {
        const queryParam = item.replace(/[\[\]]/g, '');
        const queryValues = { ...router.query, ...query };
        const label = (queryValues[queryParam] as string) ?? queryParam;

        const link = isLink
          ? path.replace(item, router.query[queryParam] as string)
          : undefined;

        return {
          label,
          link,
        };
      }

      const link = isLink ? path : undefined;

      return {
        label: item,
        link,
      };
    });
  }, [links, query, router.query, segments]);

  return (
    <div
      className={classNames(
        'flex space-x-2 rounded-lg bg-gray-50 px-6 py-4 dark:bg-black-400',
        props.className
      )}
    >
      {items.map((segment, index) => {
        const isLast = index === segments.length - 1;

        const className = classNames({
          ['text-gray-600 dark:text-gray-300']: !isLast,
          ['text-current dark:text-white']: isLast,
          ['hover:text-primary-500 dark:hover:text-white hover:underline']:
            segment.link,
        });

        return (
          <div className={'flex items-center space-x-2'} key={index}>
            <If
              condition={segment.link}
              fallback={
                <BreadcrumbItem className={className} label={segment.label} />
              }
            >
              {(link) => {
                return (
                  <Link href={link}>
                    <BreadcrumbItem
                      className={className}
                      label={segment.label}
                    />
                  </Link>
                );
              }}
            </If>

            {!isLast && (
              <ChevronRightIcon
                className={'h-5 text-gray-400 dark:text-gray-500'}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

function BreadcrumbItem({
  className,
  label,
}: React.PropsWithChildren<{ label: string | number; className: string }>) {
  return (
    <span className={classNames('font-medium', className)}>
      {capitalize(label)}
    </span>
  );
}

function capitalize(string: string | number) {
  return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
}

export default Breadcrumbs;
