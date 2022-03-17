import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import MenuAlt4Icon from '@heroicons/react/outline/MenuAlt4Icon';

import { DocsTree } from '~/core/docs/types/docs-tree';
import { isBrowser } from '~/core/generic/is-browser';
import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Heading from '~/core/ui/Heading';

import DocumentationNavigation from './DocumentationNavigation';

export default function FloatingDocumentationNavigation({
  data,
}: React.PropsWithChildren<{
  data: DocsTree[];
}>) {
  const body = useMemo(() => getBody(), []);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const enableScrolling = (element: HTMLElement) =>
    (element.style.overflowY = '');

  const disableScrolling = (element: HTMLElement) =>
    (element.style.overflowY = 'hidden');

  // enable/disable body scrolling when the docs are toggled
  useEffect(() => {
    if (!body) {
      return;
    }

    if (isVisible) {
      disableScrolling(body);
    } else {
      enableScrolling(body);
    }
  }, [isVisible, body]);

  // hide docs when navigating to another page
  useEffect(() => {
    setIsVisible(false);
  }, [router.asPath]);

  const onClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <If condition={isVisible}>
        <div
          className={
            'py-8 px-3 z-10 fixed left-0 top-0 h-screen w-full' +
            ' bg-black-500' +
            ' overflow-auto flex flex-col space-y-4'
          }
        >
          <Heading type={2}>Table of Contents</Heading>

          <DocumentationNavigation data={data} />
        </div>
      </If>

      <Button
        className={'rounded-full w-16 h-16 fixed bottom-5 right-5 z-10'}
        onClick={onClick}
      >
        <MenuAlt4Icon className={'h-8'} />
      </Button>
    </>
  );
}

function getBody() {
  return isBrowser() && document.body;
}
