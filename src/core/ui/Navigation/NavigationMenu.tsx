import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type Props =
  | {
      bordered?: boolean;
      vertical?: boolean;
    }
  | {
      secondary?: boolean;
      vertical?: boolean;
    };

function NavigationMenu(props: PropsWithChildren<Props>) {
  return (
    <ul
      className={classNames(`NavigationMenu`, {
        ['BorderedNavigationMenu']: 'bordered' in props && props.bordered,
        ['SecondaryNavigationMenu']: 'secondary' in props && props.secondary,
        ['VerticalNavigationMenu']: props.vertical,
      })}
    >
      {props.children}
    </ul>
  );
}

export default NavigationMenu;
