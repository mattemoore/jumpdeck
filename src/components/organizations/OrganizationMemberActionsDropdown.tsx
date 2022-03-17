import { PropsWithChildren } from 'react';
import { Menu } from '@headlessui/react';
import { Trans } from 'next-i18next';

import {
  AdjustmentsIcon,
  DotsVerticalIcon,
  XIcon,
} from '@heroicons/react/outline';

import Dropdown from '~/core/ui/Dropdown';
import IconButton from '~/core/ui/IconButton';

const OrganizationMemberActionsDropdown: React.FC<{
  onRemoveSelected: () => void;
  onChangeRoleSelected: () => void;
  disabled: boolean;
}> = ({ onRemoveSelected, onChangeRoleSelected, disabled }) => {
  const button = <DropdownButton disabled={disabled} />;

  return (
    <Dropdown
      button={button}
      items={[
        <Dropdown.Item
          key={1}
          data-cy={'update-member-role-action'}
          onClick={onChangeRoleSelected}
        >
          <span className={'flex space-x-2 items-center'}>
            <AdjustmentsIcon className={'h-5'} />
            <span>
              <Trans i18nKey={'organization:changeRole'} />
            </span>
          </span>
        </Dropdown.Item>,
        <Dropdown.Divider key={'divider'} />,
        <Dropdown.Item
          key={2}
          data-cy={'remove-member-action'}
          onClick={onRemoveSelected}
        >
          <span
            className={
              'flex space-x-2 items-center text-red-700 dark:text-red-500'
            }
          >
            <XIcon className={'h-5'} />
            <span>
              <Trans i18nKey={'organization:removeMember'} />
            </span>
          </span>
        </Dropdown.Item>,
      ]}
    />
  );
};

function DropdownButton({
  disabled,
}: PropsWithChildren<{ disabled: boolean }>) {
  return (
    <Menu.Button
      data-cy={'member-actions-dropdown'}
      as={'button'}
      disabled={disabled}
    >
      <IconButton label={'Open members actions menu'} as={'div'}>
        <DotsVerticalIcon className={'h-6'} />
      </IconButton>
    </Menu.Button>
  );
}

export default OrganizationMemberActionsDropdown;
