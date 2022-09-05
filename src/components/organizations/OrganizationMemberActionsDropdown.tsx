import { PropsWithChildren } from 'react';
import { Menu } from '@headlessui/react';
import { Trans } from 'next-i18next';

import {
  AdjustmentsHorizontalIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import Dropdown from '~/core/ui/Dropdown';
import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';

const OrganizationMemberActionsDropdown: React.FCC<{
  onRemoveSelected: EmptyCallback;
  onChangeRoleSelected: EmptyCallback;
  onTransferOwnershipSelected: EmptyCallback;
  disabled: boolean;
  isOwner: boolean;
}> = (props) => {
  const Button = <DropdownButton disabled={props.disabled} />;

  return (
    <Dropdown
      button={Button}
      items={[
        <Dropdown.Item
          key={1}
          data-cy={'update-member-role-action'}
          onClick={props.onChangeRoleSelected}
        >
          <span className={'flex items-center space-x-2'}>
            <AdjustmentsHorizontalIcon className={'h-5'} />
            <span>
              <Trans i18nKey={'organization:changeRole'} />
            </span>
          </span>
        </Dropdown.Item>,
        <If key={2} condition={props.isOwner}>
          <Dropdown.Item
            data-cy={'transfer-ownership-action'}
            onClick={props.onTransferOwnershipSelected}
          >
            <span className={'flex items-center space-x-2'}>
              <UserCircleIcon className={'h-5'} />
              <span>
                <Trans i18nKey={'organization:transferOwnership'} />
              </span>
            </span>
          </Dropdown.Item>
        </If>,
        <Dropdown.Divider key={'divider'} />,
        <Dropdown.Item
          key={3}
          data-cy={'remove-member-action'}
          onClick={props.onRemoveSelected}
        >
          <span
            className={
              'flex items-center space-x-2 text-red-700 dark:text-red-500'
            }
          >
            <XMarkIcon className={'h-5'} />
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
        <EllipsisVerticalIcon className={'h-6'} />
      </IconButton>
    </Menu.Button>
  );
}

export default OrganizationMemberActionsDropdown;
