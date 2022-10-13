import React, { createContext, Fragment, useContext } from 'react';

import { Popover, Transition } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';

const PopoverItem = createContext({
  close() {
    return;
  },
});

const PopoverDropdown: PopoverDropdownComponent<{
  button: JSX.Element;
}> = ({ children, button }) => {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`PopoverButton ${open ? 'PopoverButtonActive' : ' '}`}
          >
            {button}

            <span className="flex flex-1 justify-end">
              <ChevronDownIcon
                className={`PopoverChevronDownIcon ${
                  open ? '' : 'text-opacity-70'
                }`}
                aria-hidden="true"
              />
            </span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="PopoverPanel">
              <div className="overflow-hidden rounded-md">
                <div className="relative flex flex-col bg-white dark:bg-black-300">
                  <PopoverItem.Provider value={{ close }}>
                    {children}
                  </PopoverItem.Provider>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const ItemIcon: React.FCC = ({ children }) => {
  return <div className="PopoverItemIcon">{children}</div>;
};

const ItemLabel: React.FCC<{
  className?: string;
}> = ({ children, className }) => {
  return <p className={`PopoverItemLabel ${className ?? ''}`}>{children}</p>;
};

const Item: PopoverDropdownItemComponent = ({
  children,
  className,
  onClick,
}) => {
  const popover = useContext(PopoverItem);

  const itemClicked = () => {
    if (onClick) {
      onClick();
    }

    popover.close();
  };

  return (
    <div
      className={`PopoverPanelItem ${className ?? ''}`}
      onClick={itemClicked}
    >
      {children}
    </div>
  );
};

type PopoverDropdownComponent<Props> = React.FCC<Props> & {
  Item: typeof Item;
};

type PopoverDropdownItemComponent = React.FCC<{
  onClick?: () => void;
  className?: string;
}> & {
  Label: typeof ItemLabel;
  Icon: typeof ItemIcon;
};

Item.Label = ItemLabel;
Item.Icon = ItemIcon;

PopoverDropdown.Item = Item;

export const PopoverDropdownItem = Item;
export { PopoverDropdown };
