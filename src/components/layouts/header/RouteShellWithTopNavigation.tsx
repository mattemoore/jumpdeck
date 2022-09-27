import React from 'react';
import AppHeaderWithMenu from './AppHeaderWithMenu';
import Container from '~/core/ui/Container';

const RouteShellWithTopNavigation: React.FCC<{
  title: string;
}> = ({ title, children }) => {
  return (
    <div className={'flex flex-1'}>
      <div className={'relative w-full'}>
        <AppHeaderWithMenu>{title}</AppHeaderWithMenu>

        <div className={'p-4'}>
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
};

export default RouteShellWithTopNavigation;
