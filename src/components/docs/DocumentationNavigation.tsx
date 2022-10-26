import { useRouter } from 'next/router';
import Link from 'next/link';

import { DocsTree } from '~/core/docs/types/docs-tree';
import Heading from '~/core/ui/Heading';

export default function DocumentationNavigation({
  data,
}: React.PropsWithChildren<{
  data: DocsTree[];
}>) {
  const router = useRouter();
  const path = router.query.page;

  return (
    <div className={'flex h-full flex-col space-y-8'}>
      {data.map(({ directory, pages }) => {
        return (
          <div
            className={'DocumentationSidebarItemContainer'}
            key={directory.title}
          >
            <div className={'flex flex-col space-y-1'}>
              <div className={'pb-4'}>
                <Heading type={6}>
                  <span
                    className={
                      'text-sm font-bold uppercase text-gray-700' +
                      ' dark:text-gray-300'
                    }
                  >
                    {directory.title}
                  </span>
                </Heading>
              </div>

              {pages.map((page) => {
                const selected = path === page.slug;
                const href = `/docs/${page.slug}`;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`DocumentationSidebarItem ${
                      selected
                        ? `DocumentationSidebarItemSelected`
                        : `DocumentationSidebarItemNotSelected`
                    }`}
                  >
                    <span>{page.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
