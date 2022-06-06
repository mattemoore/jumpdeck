import { PropsWithChildren } from 'react';
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners';

import LogoImage from '~/core/ui/Logo/LogoImage';
import If from '~/core/ui/If';
import classNames from 'classnames';

/**
 * @name PageLoadingIndicator
 * @description Display a standard loading indicator across the application.
 * @param children
 * @param fullPage
 * @param displayLogo
 * @constructor
 */
function PageLoadingIndicator({
  children,
  fullPage,
  displayLogo,
}: PropsWithChildren<{
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  const useFullPage = fullPage ?? true;
  const shouldDisplayLogo = displayLogo ?? true;

  return (
    <div
      className={classNames(
        `flex flex-col items-center justify-center space-y-6`,
        {
          [`fixed top-0 left-0 z-[100] h-screen w-screen bg-white opacity-90`]:
            useFullPage,
          [`dark:bg-black-500`]: !useFullPage,
        }
      )}
    >
      <If condition={shouldDisplayLogo}>
        <div className={'my-2'}>
          <LogoImage />
        </div>
      </If>

      <FulfillingBouncingCircleSpinner size={48} color={`currentColor`} />

      <div className={'text-sm font-medium'}>{children}</div>
    </div>
  );
}

export default PageLoadingIndicator;
