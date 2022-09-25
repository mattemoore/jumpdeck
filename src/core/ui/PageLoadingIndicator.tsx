import { PropsWithChildren } from 'react';
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners';

import LogoImage from '~/core/ui/Logo/LogoImage';
import If from '~/core/ui/If';

export default function PageLoadingIndicator({
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
      className={`flex flex-col items-center justify-center space-y-6 ${
        useFullPage
          ? 'fixed top-0 left-0 z-[100] h-screen w-screen bg-white' +
            ' dark:bg-black-500'
          : ''
      }`}
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
