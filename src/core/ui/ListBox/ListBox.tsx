import { Fragment, PropsWithChildren } from 'react';
import { Trans } from 'next-i18next';

import { Listbox, Transition } from '@headlessui/react';
import SelectorIcon from '~/core/ui/SelectorIcon';

export interface ListBoxOptionModel<Value = unknown> {
  label: string;
  value: Value;

  [key: string]: unknown;
}

function ListBox<Value>({
  cy,
  value,
  setValue,
  children,
}: PropsWithChildren<{
  cy?: string;
  value: ListBoxOptionModel<Value>;
  setValue: (value: ListBoxOptionModel<Value>) => void;
}>) {
  return (
    <Listbox value={value} onChange={setValue}>
      <div className="relative">
        <Listbox.Button
          data-cy={cy}
          className={({ open }) => {
            return `ListBoxButton ${open ? `ListBoxButtonOpen` : ''}`;
          }}
        >
          <span className="block truncate">
            <Trans i18nKey={value.label} />
          </span>

          <span className="ListBoxButtonIcon">
            <SelectorIcon aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="ListBoxOptionsContainer">
            {children}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default ListBox;
