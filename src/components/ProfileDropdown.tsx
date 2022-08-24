import type { UserInfo } from 'firebase/auth';
import { Trans } from 'next-i18next';
import { Menu } from '@headlessui/react';

import {
  MinusIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

import Dropdown from '~/core/ui/Dropdown';
import ProfileAvatar from './ProfileAvatar';

const ProfileDropdown: React.FCC<{
  user: Maybe<UserInfo>;
  signOutRequested: () => void;
}> = ({ user, signOutRequested }) => {
  const ProfileDropdownButton = (
    <Menu.Button
      as={'span'}
      className={'flex cursor-pointer items-center space-x-2'}
    >
      <ProfileAvatar user={user} />
      <ChevronDownIcon className={'hidden h-3 sm:block'} />
    </Menu.Button>
  );

  const items = [
    <ProfileDropdownMenuItem key={'profile'} href={'/dashboard'}>
      <Squares2X2Icon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:dashboardTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <ProfileDropdownMenuItem key={'profile'} href={'/settings/profile'}>
      <Cog8ToothIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'common:settingsTabLabel'} />
      </span>
    </ProfileDropdownMenuItem>,
    <Dropdown.Divider key={'divider'} />,
    <ProfileDropdownMenuItem key={'sign-out'} onClick={signOutRequested}>
      <MinusIcon className={'h-5'} />
      <span>
        <Trans i18nKey={'auth:signOut'} />
      </span>
    </ProfileDropdownMenuItem>,
  ];

  return <Dropdown button={ProfileDropdownButton} items={items} />;
};

function ProfileDropdownMenuItem(
  props: React.PropsWithChildren<
    | {
        onClick?: () => void;
      }
    | {
        href?: string;
      }
  >
) {
  const onClick = 'onClick' in props ? props.onClick : undefined;
  const href = 'href' in props ? props.href : undefined;

  return (
    <Dropdown.Item href={href} onClick={onClick}>
      <span className={'space-between flex w-full items-center space-x-4'}>
        {props.children}
      </span>
    </Dropdown.Item>
  );
}

export default ProfileDropdown;
