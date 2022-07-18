import { PropsWithChildren } from 'react';

function NavigationMenu({
  children,
  bordered,
}: PropsWithChildren<{
  bordered?: boolean;
}>) {
  return (
    <ul
      className={`NavigationMenu ${bordered ? 'BorderedNavigationMenu' : ''}`}
    >
      {children}
    </ul>
  );
}

export default NavigationMenu;
