import { Fragment, PropsWithChildren } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Button from '~/core/ui/Button';

type ItemProps = PropsWithChildren<{ className?: string; href?: string }> &
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
            const isDivider = item.type.name === 'Divider';

            if (isDivider) {
              return [item];
            }

            return (
              <Menu.Item as={'div'} key={index}>
                {({ active }) => (
                  <div
                    className={`${
                      active ? 'DropdownActiveItem' : 'text-gray-900'
                    } DropdownItem`}
                  >
                    {item}
                  </div>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

function Divider() {
  return <hr className="DropdownDivider" />;
}

function Item({ children, ...props }: ItemProps) {
  return (
    <Button
      block
      href={props.href}
      onClick={props.onClick}
      color={'custom'}
      size={'custom'}
      className={'justify-start'}
      {...props}
    >
      <span className={'flex w-full flex-1 px-6 py-4 font-normal'}>
        {children}
      </span>
    </Button>
  );
}

Dropdown.Divider = Divider;
Dropdown.Item = Item;

export default Dropdown;
