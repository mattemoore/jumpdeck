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
            'fixed left-0 top-0 z-10 h-screen w-full py-8 px-3' +
            ' bg-black-500' +
            ' flex flex-col space-y-4 overflow-auto'
          }
        >
          <Heading type={2}>Table of Contents</Heading>

          <DocumentationNavigation data={data} />
        </div>
      </If>

      <Button
        className={'fixed bottom-5 right-5 z-10 h-16 w-16 rounded-full'}
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
