import { useRouter } from 'next/router';
import Link from 'next/link';

import Heading from '~/core/ui/Heading';
import { DocsTree } from '~/core/docs/types/docs-tree';

export default function DocumentationNavigation({
  data,
}: React.PropsWithChildren<{
  data: DocsTree[];
}>) {
  const router = useRouter();
  const path = router.query.page;

  return (
    <div className={'flex flex-col space-y-2 h-full'}>
      {data.map(({ directory, pages }) => {
        return (
          <div
            className={'DocumentationSidebarItemContainer'}
            key={directory.title}
          >
            <div className={'px-1 py-3'}>
              <Heading type={3}>{directory.title}</Heading>
            </div>

            <div className={'flex flex-col'}>
              {pages.map((page) => {
                const selected = path === page.slug;
                const href = `/docs/${page.slug}`;

                return (
                  <Link key={href} href={href} passHref>
                    <a
                      className={`DocumentationSidebarItem ${
                        selected
                          ? `DocumentationSidebarItemSelected`
                          : `DocumentationSidebarItemNotSelected`
                      }`}
                      key={page.label}
                    >
                      <span className={'text-sm'}>{page.label}</span>
                    </a>
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
