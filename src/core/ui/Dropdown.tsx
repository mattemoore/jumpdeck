import { Fragment, PropsWithChildren } from 'react';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

import Button from '~/core/ui/Button';

type ItemProps = PropsWithChildren<{
  className?: string;
  href?: string;
}> &
  React.ComponentProps<typeof Button>;

const Dropdown: React.FCC<{
  button: JSX.Element;
  items: Array<JSX.Element>;
}> & {
  Divider: typeof Divider;
  Item: typeof Item;
} = ({ items, button }) => {
  return (
    <Menu as="div" className="DropdownMenu">
      <div className="DropdownMenuButtonContainer">{button}</div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="DropdownMenuItemsContainer">
          {items.map((item, index) => {
            return <Fragment key={index}>{item}</Fragment>;
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

function Divider() {
  return <hr className="DropdownDivider" />;
}

function Item({ children, className, ...props }: ItemProps) {
  const isStaticItem = !props.onClick && !props.href;

  return (
    <Menu.Item as={'div'}>
      {({ active }) => (
        <div
          className={`${
            active ? 'DropdownActiveItem' : 'text-gray-900'
          } DropdownItem`}
        >
          <Button
            block
            href={props.href}
            onClick={props.onClick}
            color={'custom'}
            size={'custom'}
            className={classNames(`justify-start`, className, {
              [`static`]: isStaticItem,
            })}
            {...props}
          >
            <span className={'flex w-full flex-1 px-5 py-3 font-normal'}>
              {children}
            </span>
          </Button>
        </div>
      )}
    </Menu.Item>
  );
}

Dropdown.Divider = Divider;
Dropdown.Item = Item;

export default Dropdown;
