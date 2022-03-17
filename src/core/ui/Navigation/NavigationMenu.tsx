import { PropsWithChildren } from 'react';

function NavigationMenu({ children }: PropsWithChildren<unknown>) {
  return <ul className="NavigationMenu">{children}</ul>;
}

export default NavigationMenu;
