import { Trans } from 'next-i18next';

import {
  AdjustmentsHorizontalIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '~/core/ui/Dropdown';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';

const OrganizationMemberActionsDropdown: React.FCC<{
  onRemoveSelected: EmptyCallback;
  onChangeRoleSelected: EmptyCallback;
  onTransferOwnershipSelected: EmptyCallback;
  disabled: boolean;
  isOwner: boolean;
}> = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={props.disabled}>
        <IconButton
          data-cy={'member-actions-dropdown'}
          disabled={props.disabled}
          label={'Open members actions menu'}
        >
          <EllipsisVerticalIcon className={'h-6'} />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent collisionPadding={{ right: 50 }}>
        <DropdownMenuItem
          data-cy={'update-member-role-action'}
          className={'cursor-pointer'}
          onClick={props.onChangeRoleSelected}
        >
          <span className={'flex items-center space-x-2'}>
            <AdjustmentsHorizontalIcon className={'h-5'} />

            <span>
              <Trans i18nKey={'organization:changeRole'} />
            </span>
          </span>
        </DropdownMenuItem>

        <If condition={props.isOwner}>
          <DropdownMenuItem
            data-cy={'transfer-ownership-action'}
            className={'cursor-pointer'}
            onClick={props.onTransferOwnershipSelected}
          >
            <span className={'flex items-center space-x-2'}>
              <UserCircleIcon className={'h-5'} />
              <span>
                <Trans i18nKey={'organization:transferOwnership'} />
              </span>
            </span>
          </DropdownMenuItem>
        </If>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          data-cy={'remove-member-action'}
          className={
            'cursor-pointer focus:!bg-red-50 dark:focus:!bg-red-500/10'
          }
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationMemberActionsDropdown;
