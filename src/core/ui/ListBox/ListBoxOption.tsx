import { Listbox } from '@headlessui/react';
import { Trans } from 'next-i18next';
import CheckCircleIcon from '@heroicons/react/outline/CheckCircleIcon';

import If from '~/core/ui/If';

interface Option {
  label: string;
  value: unknown;
  description?: string;
}

const ListBoxOption: React.FCC<{
  option: Option;
}> = ({ option }) => {
  return (
    <Listbox.Option
      className={({ active, selected }) =>
        `${selected ? 'ListBoxOptionSelected' : 'ListBoxOptionNotSelected'} ${
          active ? 'ListBoxOptionActive' : 'ListBoxOptionNotActive'
        } ListBoxOption`
      }
      value={option}
    >
      {({ selected }) => (
        <div className={'flex flex-col space-y-1'}>
          <div data-cy={`listbox-option-${option.value as string}`}>
            <span className={`block truncate`}>
              <Trans i18nKey={option.label} />
            </span>

            <If condition={selected}>
              <span className={`ListBoxOptionIcon`}>
                <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
              </span>
            </If>
          </div>

          <If condition={option.description}>
            <div className={'ListBoxOptionDescription'}>
              <Trans i18nKey={option.description} />
            </div>
          </If>
        </div>
      )}
    </Listbox.Option>
  );
};

export default ListBoxOption;
