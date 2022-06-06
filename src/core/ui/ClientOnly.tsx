import { createElement } from 'react';

import { isBrowser } from '~/core/generic/is-browser';
import If from '~/core/ui/If';

const DEFAULT_ELEMENT_SELECTOR = 'div';

const ClientOnly: React.FCC<{
  as?: string;
}> = ({ children, as }) => {
  const selector = as ?? DEFAULT_ELEMENT_SELECTOR;
  const shouldDisplayChildren = isBrowser();

  return (
    <ElementWrapper as={selector}>
      <If condition={shouldDisplayChildren}>
        <>{children}</>
      </If>
    </ElementWrapper>
  );
};

function ElementWrapper({
  as,
  children,
}: React.PropsWithChildren<{ as: string }>) {
  return createElement(
    as,
    {
      suppressHydrationWarning: true,
    },
    children
  );
}

export default ClientOnly;
